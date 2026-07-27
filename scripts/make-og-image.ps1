# 카카오톡 링크 미리보기에 뜨는 대표 이미지(public/og-default.png)를 만듭니다.
#
# src/data/site.json 의 name / tagline 을 읽어서 그립니다.
# 사이트 이름을 바꾼 뒤에는 이 스크립트를 다시 실행하세요.
#
#   powershell -ExecutionPolicy Bypass -File scripts\make-og-image.ps1

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

# 이름이 길면 자동 줄바꿈에 맡기지 않고 띄어쓰기 위치에서 두 줄로 나눈다.
# (맡겨두면 "... 게시 / 판" 처럼 단어 중간에서 잘린다)
function Split-BalancedLines([string]$text) {
    $words = $text -split '\s+' | Where-Object { $_ }
    if ($words.Count -lt 2) { return $text }

    $bestLine = $text
    $bestDiff = [int]::MaxValue

    for ($i = 1; $i -lt $words.Count; $i++) {
        $left = ($words[0..($i - 1)] -join ' ')
        $right = ($words[$i..($words.Count - 1)] -join ' ')
        $diff = [math]::Abs(($left -replace '\s', '').Length - ($right -replace '\s', '').Length)

        if ($diff -lt $bestDiff) {
            $bestDiff = $diff
            $bestLine = $left + [char]10 + $right
        }
    }

    return $bestLine
}

$root = Split-Path -Parent $PSScriptRoot
$site = Get-Content (Join-Path $root 'src\data\site.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$outPath = Join-Path $root 'public\og-default.png'

# 카카오톡·슬랙 권장 비율 (1.91:1)
$width = 1200
$height = 630

$bitmap = New-Object System.Drawing.Bitmap($width, $height)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

try {
    # 배경 — 브랜드 색상 세로 그라데이션
    # (Point, Point, Color, Color) 오버로드를 쓴다. Rectangle 오버로드는
    # PowerShell 이 RectangleF 와 구분하지 못해 New-Object 가 실패한다.
    $topPoint = New-Object System.Drawing.Point(0, 0)
    $bottomPoint = New-Object System.Drawing.Point(0, $height)
    $gradient = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        $topPoint,
        $bottomPoint,
        [System.Drawing.ColorTranslator]::FromHtml('#1f5fa9'),
        [System.Drawing.ColorTranslator]::FromHtml('#143f74')
    )
    $graphics.FillRectangle($gradient, 0, 0, $width, $height)

    # 아래쪽 강조 바
    $graphics.FillRectangle([System.Drawing.Brushes]::White, 0, ($height - 10), $width, 10)

    # 가운데 정렬
    $format = New-Object System.Drawing.StringFormat
    $format.Alignment = [System.Drawing.StringAlignment]::Center
    $format.LineAlignment = [System.Drawing.StringAlignment]::Center

    # 이름이 길면 두 줄로 나누고 글자도 조금 줄인다.
    if ($site.name.Length -gt 12) {
        $titleText = Split-BalancedLines $site.name
        $titleSize = 62
    }
    else {
        $titleText = $site.name
        $titleSize = 72
    }

    $titleFont = New-Object System.Drawing.Font('Malgun Gothic', $titleSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $taglineFont = New-Object System.Drawing.Font('Malgun Gothic', 34, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)

    $softColor = [System.Drawing.Color]::FromArgb(215, 232, 244, 255)
    $white = [System.Drawing.Brushes]::White
    $soft = New-Object System.Drawing.SolidBrush -ArgumentList $softColor

    $titleRect = New-Object System.Drawing.RectangleF(80, 180, ($width - 160), 200)
    $taglineRect = New-Object System.Drawing.RectangleF(80, 400, ($width - 160), 70)

    $graphics.DrawString($titleText, $titleFont, $white, $titleRect, $format)
    $graphics.DrawString($site.tagline, $taglineFont, $soft, $taglineRect, $format)

    $bitmap.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    Write-Output "생성 완료: $outPath"
}
finally {
    $graphics.Dispose()
    $bitmap.Dispose()
}
