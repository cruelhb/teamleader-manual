# 카카오톡 링크 미리보기에 뜨는 대표 이미지(public/og-default.png)를 만듭니다.
#
# src/data/site.json 의 name / shortName / tagline 을 읽어서 그립니다.
# 사이트 이름을 바꾼 뒤에는 이 스크립트를 다시 실행하세요.
#
#   powershell -ExecutionPolicy Bypass -File scripts\make-og-image.ps1
#
# 2026-10-29 사이트 디자인("앱처럼 친근한" 카드형)에 맞춰 다시 그렸습니다.
# 연한 회색 바탕 위에 흰 둥근 카드를 얹고, 그 안에 로고 뱃지 + 짧은 이름,
# 두 줄 제목(둘째 줄만 브랜드색), 설명 한 줄을 넣습니다.

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

# --- 도우미 ---------------------------------------------------------------

# 둥근 사각형 경로
function New-RoundedRect([single]$x, [single]$y, [single]$w, [single]$h, [single]$r) {
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $d = $r * 2
    $path.AddArc($x, $y, $d, $d, 180, 90)
    $path.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
    $path.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
    $path.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
    $path.CloseFigure()
    return $path
}

function Get-Color([string]$hex) { return [System.Drawing.ColorTranslator]::FromHtml($hex) }

# 설치된 글꼴 중 먼저 찾은 것을 쓴다 (Pretendard 가 없으면 맑은 고딕)
function Resolve-FontFamily([string[]]$candidates) {
    $installed = (New-Object System.Drawing.Text.InstalledFontCollection).Families | ForEach-Object { $_.Name }
    foreach ($name in $candidates) {
        if ($installed -contains $name) { return $name }
    }
    return 'Malgun Gothic'
}

# 24칸 격자로 그린 로고(펼친 책)를 원하는 크기로 옮겨 그린다.
# src/lib/icons.ts 의 logo 와 같은 모양이다.
function Draw-BookIcon($graphics, [single]$cx, [single]$cy, [single]$size, $color) {
    $s = $size / 24.0
    $ox = $cx - $size / 2
    $oy = $cy - $size / 2
    $pt = { param($x, $y) New-Object System.Drawing.PointF(($ox + $x * $s), ($oy + $y * $s)) }

    $pen = New-Object System.Drawing.Pen($color, ($size * 0.075))
    $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round

    try {
        # 책 바깥선 — 가운데 위에서 시작해 왼쪽 페이지, 아래, 오른쪽 페이지 순서
        $outline = New-Object System.Drawing.Drawing2D.GraphicsPath
        $outline.AddBezier((& $pt 12 6.5), (& $pt 9.5 4.8), (& $pt 6.5 4.5), (& $pt 3 5))
        $outline.AddLine((& $pt 3 5), (& $pt 3 19))
        $outline.AddBezier((& $pt 3 19), (& $pt 6.5 18.5), (& $pt 9.5 18.8), (& $pt 12 20.5))
        $outline.AddBezier((& $pt 12 20.5), (& $pt 14.5 18.8), (& $pt 17.5 18.5), (& $pt 21 19))
        $outline.AddLine((& $pt 21 19), (& $pt 21 5))
        $outline.AddBezier((& $pt 21 5), (& $pt 17.5 4.5), (& $pt 14.5 4.8), (& $pt 12 6.5))
        $graphics.DrawPath($pen, $outline)
        $outline.Dispose()

        # 가운데 접힌 선과 좌우 짧은 줄
        $graphics.DrawLine($pen, (& $pt 12 6.5), (& $pt 12 20.5))
        $graphics.DrawLine($pen, (& $pt 6 9), (& $pt 9 9))
        $graphics.DrawLine($pen, (& $pt 15 9), (& $pt 18 9))
    }
    finally {
        $pen.Dispose()
    }
}

# --- 재료 -----------------------------------------------------------------

$root = Split-Path -Parent $PSScriptRoot
$site = Get-Content (Join-Path $root 'src\data\site.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$outPath = Join-Path $root 'public\og-default.png'

# 이름은 첫 낱말과 나머지로 나눠 두 줄로 쓴다 (예: 서면심사본부 / 업무 가이드북).
$words = $site.name -split '\s+' | Where-Object { $_ }
if ($words.Count -ge 2) {
    $titleTop = $words[0]
    $titleBottom = ($words[1..($words.Count - 1)] -join ' ')
}
else {
    $titleTop = $null
    $titleBottom = $site.name
}

# 사이트 디자인 토큰(global.css :root)과 같은 색
$bg = Get-Color '#f2f4f6'
$surface = [System.Drawing.Color]::White
$brand = Get-Color '#2563eb'
$text = Get-Color '#191f28'
$textMuted = Get-Color '#4e5968'

$fontName = Resolve-FontFamily @('Pretendard Variable', 'Pretendard', 'Malgun Gothic')

# 카카오톡·슬랙 권장 비율 (1.91:1)
$width = 1200
$height = 630

$bitmap = New-Object System.Drawing.Bitmap($width, $height)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

try {
    # 바탕 — 연한 회색
    $graphics.Clear($bg)

    # 오른쪽 위에 브랜드색이 아주 옅게 번지게 (홈 카드의 색 영역과 같은 느낌).
    # 가장자리가 보이지 않도록 가운데에서 바깥으로 서서히 사라지는 붓을 쓴다.
    $glowPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    $glowPath.AddEllipse(700, -320, 900, 900)
    $glow = New-Object System.Drawing.Drawing2D.PathGradientBrush $glowPath
    $glow.CenterColor = [System.Drawing.Color]::FromArgb(46, $brand)
    $glow.SurroundColors = @([System.Drawing.Color]::FromArgb(0, $brand))
    $graphics.FillPath($glow, $glowPath)
    $glow.Dispose(); $glowPath.Dispose()

    # 흰 카드 — 그림자 두 겹을 깔고 그 위에 올린다
    $cardX = 64; $cardY = 64; $cardW = 1072; $cardH = 502; $cardR = 44

    foreach ($shadow in @(@(14, 10, 26), @(10, 4, 14))) {
        $alpha = $shadow[0]; $dy = $shadow[1]; $spread = $shadow[2]
        $path = New-RoundedRect ($cardX - $spread / 2) ($cardY + $dy) ($cardW + $spread) $cardH ($cardR + 6)
        $brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb($alpha, 25, 31, 40))
        $graphics.FillPath($brush, $path)
        $brush.Dispose(); $path.Dispose()
    }

    $cardPath = New-RoundedRect $cardX $cardY $cardW $cardH $cardR
    $cardBrush = New-Object System.Drawing.SolidBrush $surface
    $graphics.FillPath($cardBrush, $cardPath)
    $cardBrush.Dispose(); $cardPath.Dispose()

    # --- 카드 안 내용 ---
    $pad = 84
    $left = $cardX + $pad

    # 로고 뱃지 (헤더의 파란 둥근 사각형 + 흰 책 아이콘)
    $badge = 96
    $badgeY = $cardY + 68
    $badgePath = New-RoundedRect $left $badgeY $badge $badge 28
    $badgeBrush = New-Object System.Drawing.SolidBrush $brand
    $graphics.FillPath($badgeBrush, $badgePath)
    $badgeBrush.Dispose(); $badgePath.Dispose()
    Draw-BookIcon $graphics ($left + $badge / 2) ($badgeY + $badge / 2) ($badge * 0.56) ([System.Drawing.Color]::White)

    $typographic = [System.Drawing.StringFormat]::GenericTypographic

    # 짧은 이름(워드마크)은 뱃지 오른쪽에 세로 가운데로
    $markFont = New-Object System.Drawing.Font($fontName, 40, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $markSize = $graphics.MeasureString($site.shortName, $markFont, 1000, $typographic)
    $markBrush = New-Object System.Drawing.SolidBrush $text
    $graphics.DrawString($site.shortName, $markFont, $markBrush, ($left + $badge + 24), ($badgeY + ($badge - $markSize.Height) / 2), $typographic)
    $markBrush.Dispose(); $markFont.Dispose()

    # 제목 두 줄 — 아랫줄만 브랜드색 (홈 제목과 같은 리듬)
    $titleFont = New-Object System.Drawing.Font($fontName, 78, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $titleTopBrush = New-Object System.Drawing.SolidBrush $text
    $titleBottomBrush = New-Object System.Drawing.SolidBrush $brand

    $titleY = $badgeY + $badge + 36
    if ($titleTop) {
        $graphics.DrawString($titleTop, $titleFont, $titleTopBrush, $left, $titleY, $typographic)
        $titleY += 96
    }
    $graphics.DrawString($titleBottom, $titleFont, $titleBottomBrush, $left, $titleY, $typographic)

    $titleTopBrush.Dispose(); $titleBottomBrush.Dispose(); $titleFont.Dispose()

    # 설명 한 줄
    $taglineFont = New-Object System.Drawing.Font($fontName, 34, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $taglineBrush = New-Object System.Drawing.SolidBrush $textMuted
    $graphics.DrawString($site.tagline, $taglineFont, $taglineBrush, $left, ($titleY + 140), $typographic)
    $taglineBrush.Dispose(); $taglineFont.Dispose()

    $bitmap.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    Write-Output "생성 완료: $outPath (글꼴: $fontName)"
}
finally {
    $graphics.Dispose()
    $bitmap.Dispose()
}
