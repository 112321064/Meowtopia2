Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$outDir = Join-Path $root "printables"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$Width = 2480
$Height = 3508
$Dpi = 300

function New-Canvas {
    $bmp = New-Object System.Drawing.Bitmap $Width, $Height, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $bmp.SetResolution($Dpi, $Dpi)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.Clear([System.Drawing.Color]::White)
    return @($bmp, $g)
}

function New-Path {
    return New-Object System.Drawing.Drawing2D.GraphicsPath
}

function Add-PolygonPath($path, $points) {
    $path.AddPolygon([System.Drawing.Point[]]$points)
}

function Draw-PathShadow($g, $path, $dx, $dy, $alpha) {
    $state = $g.Save()
    $g.TranslateTransform($dx, $dy)
    $brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb($alpha, 68, 47, 35))
    $g.FillPath($brush, $path)
    $brush.Dispose()
    $g.Restore($state)
}

function Fill-GradientEllipse($g, $rect, $centerColor, $edgeColor) {
    $path = New-Path
    $path.AddEllipse($rect)
    $brush = New-Object System.Drawing.Drawing2D.PathGradientBrush $path
    $brush.CenterColor = $centerColor
    $brush.SurroundColors = [System.Drawing.Color[]]@($edgeColor)
    $g.FillPath($brush, $path)
    $brush.Dispose()
    $path.Dispose()
}

function Draw-OuterGuide($g) {
    $pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(45, 150, 130, 80)), 4
    $pen.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dash
    $g.DrawLine($pen, 1240, 170, 1240, 3210)
    $pen.Dispose()
}

function Draw-Tail($g, [bool]$back) {
    $pts = @(
        (New-Object System.Drawing.Point(1375, 2145)),
        (New-Object System.Drawing.Point(1610, 1840)),
        (New-Object System.Drawing.Point(1508, 1646)),
        (New-Object System.Drawing.Point(1845, 1228)),
        (New-Object System.Drawing.Point(1718, 1012)),
        (New-Object System.Drawing.Point(2040, 230)),
        (New-Object System.Drawing.Point(1900, 1118)),
        (New-Object System.Drawing.Point(2050, 1334)),
        (New-Object System.Drawing.Point(1714, 1762)),
        (New-Object System.Drawing.Point(1810, 1948)),
        (New-Object System.Drawing.Point(1515, 2295))
    )
    $path = New-Path
    Add-PolygonPath $path $pts
    Draw-PathShadow $g $path 28 35 55
    $outline = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 88, 60, 34)), 34
    $outline.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
    $g.DrawPath($outline, $path)
    $brush = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
        (New-Object System.Drawing.Rectangle(1500, 230, 560, 2080)),
        ([System.Drawing.Color]::FromArgb(255, 255, 228, 58)),
        ([System.Drawing.Color]::FromArgb(255, 231, 167, 33)),
        ([System.Drawing.Drawing2D.LinearGradientMode]::ForwardDiagonal)
    )
    $g.FillPath($brush, $path)
    $highlight = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(150, 255, 250, 168)), 13
    $highlight.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
    $g.DrawPath($highlight, $path)
    if ($back) {
        $base = New-Path
        Add-PolygonPath $base @(
            (New-Object System.Drawing.Point(1375, 2145)),
            (New-Object System.Drawing.Point(1515, 2295)),
            (New-Object System.Drawing.Point(1430, 2395)),
            (New-Object System.Drawing.Point(1288, 2240))
        )
        $brown = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 117, 68, 31))
        $g.FillPath($brown, $base)
        $g.DrawPath($outline, $base)
        $brown.Dispose()
        $base.Dispose()
    }
    $highlight.Dispose()
    $brush.Dispose()
    $outline.Dispose()
    $path.Dispose()
}

function Draw-Ear($g, $points, $tipPoints) {
    $ear = New-Path
    Add-PolygonPath $ear $points
    Draw-PathShadow $g $ear 18 24 38
    $outline = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 66, 43, 32)), 28
    $outline.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
    $fill = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
        (New-Object System.Drawing.Rectangle(760, 480, 960, 780)),
        ([System.Drawing.Color]::FromArgb(255, 255, 230, 84)),
        ([System.Drawing.Color]::FromArgb(255, 232, 178, 42)),
        ([System.Drawing.Drawing2D.LinearGradientMode]::Vertical)
    )
    $g.FillPath($fill, $ear)
    $g.DrawPath($outline, $ear)
    $tip = New-Path
    Add-PolygonPath $tip $tipPoints
    $black = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
        (New-Object System.Drawing.Rectangle(760, 420, 960, 420)),
        ([System.Drawing.Color]::FromArgb(255, 18, 16, 23)),
        ([System.Drawing.Color]::FromArgb(255, 55, 38, 54)),
        ([System.Drawing.Drawing2D.LinearGradientMode]::ForwardDiagonal)
    )
    $g.FillPath($black, $tip)
    $g.DrawPath($outline, $tip)
    $black.Dispose()
    $tip.Dispose()
    $fill.Dispose()
    $outline.Dispose()
    $ear.Dispose()
}

function Draw-CommonBody($g, [bool]$back) {
    Draw-Tail $g $back

    Draw-Ear $g @(
        (New-Object System.Drawing.Point(900, 1000)),
        (New-Object System.Drawing.Point(790, 560)),
        (New-Object System.Drawing.Point(895, 468)),
        (New-Object System.Drawing.Point(1060, 945))
    ) @(
        (New-Object System.Drawing.Point(790, 560)),
        (New-Object System.Drawing.Point(895, 468)),
        (New-Object System.Drawing.Point(950, 646)),
        (New-Object System.Drawing.Point(845, 680))
    )
    Draw-Ear $g @(
        (New-Object System.Drawing.Point(1580, 1000)),
        (New-Object System.Drawing.Point(1690, 560)),
        (New-Object System.Drawing.Point(1585, 468)),
        (New-Object System.Drawing.Point(1420, 945))
    ) @(
        (New-Object System.Drawing.Point(1690, 560)),
        (New-Object System.Drawing.Point(1585, 468)),
        (New-Object System.Drawing.Point(1530, 646)),
        (New-Object System.Drawing.Point(1635, 680))
    )

    Fill-GradientEllipse $g `
        (New-Object System.Drawing.Rectangle(865, 1700, 750, 1030)) `
        ([System.Drawing.Color]::FromArgb(255, 255, 232, 80)) `
        ([System.Drawing.Color]::FromArgb(255, 224, 168, 42))
    $bodyOutline = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 90, 60, 36)), 30
    $g.DrawEllipse($bodyOutline, 865, 1700, 750, 1030)

    Fill-GradientEllipse $g `
        (New-Object System.Drawing.Rectangle(735, 820, 1010, 1045)) `
        ([System.Drawing.Color]::FromArgb(255, 255, 235, 84)) `
        ([System.Drawing.Color]::FromArgb(255, 225, 169, 46))
    $g.DrawEllipse($bodyOutline, 735, 820, 1010, 1045)

    $armPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 92, 61, 36)), 120
    $armPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $armPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $armFill = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 255, 220, 66)), 90
    $armFill.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $armFill.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $g.DrawLine($armPen, 930, 1845, 628, 1615)
    $g.DrawLine($armPen, 1550, 1845, 1852, 1615)
    $g.DrawLine($armFill, 930, 1845, 628, 1615)
    $g.DrawLine($armFill, 1550, 1845, 1852, 1615)

    Fill-GradientEllipse $g `
        (New-Object System.Drawing.Rectangle(770, 2570, 260, 185)) `
        ([System.Drawing.Color]::FromArgb(255, 255, 225, 74)) `
        ([System.Drawing.Color]::FromArgb(255, 216, 159, 38))
    Fill-GradientEllipse $g `
        (New-Object System.Drawing.Rectangle(1450, 2570, 260, 185)) `
        ([System.Drawing.Color]::FromArgb(255, 255, 225, 74)) `
        ([System.Drawing.Color]::FromArgb(255, 216, 159, 38))
    $g.DrawEllipse($bodyOutline, 770, 2570, 260, 185)
    $g.DrawEllipse($bodyOutline, 1450, 2570, 260, 185)
    $bodyOutline.Dispose()
}

function Draw-Front {
    $items = New-Canvas
    $bmp = $items[0]
    $g = $items[1]

    Draw-CommonBody $g $false

    $eyeBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 45, 30, 29))
    $g.FillEllipse($eyeBrush, 965, 1165, 132, 172)
    $g.FillEllipse($eyeBrush, 1383, 1165, 132, 172)
    $hi = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
    $g.FillEllipse($hi, 1002, 1192, 42, 55)
    $g.FillEllipse($hi, 1420, 1192, 42, 55)
    $cheek = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 235, 71, 58))
    $g.FillEllipse($cheek, 800, 1370, 190, 170)
    $g.FillEllipse($cheek, 1490, 1370, 190, 170)
    $nose = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 55, 34, 31))
    $g.FillEllipse($nose, 1220, 1364, 40, 24)

    $mouth = New-Path
    $mouth.AddBezier(1138, 1450, 1190, 1515, 1290, 1515, 1342, 1450)
    $mouthPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 72, 38, 38)), 24
    $mouthPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $mouthPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $g.DrawPath($mouthPen, $mouth)
    $tongue = New-Path
    $tongue.AddBezier(1125, 1512, 1185, 1606, 1295, 1606, 1355, 1512)
    $tongue.AddBezier(1355, 1512, 1285, 1560, 1195, 1560, 1125, 1512)
    $tongueBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 224, 73, 76))
    $g.FillPath($tongueBrush, $tongue)
    $g.DrawPath($mouthPen, $tongue)

    $out = Join-Path $outDir "pikachu-pointer-front.png"
    $bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    return $out
}

function Draw-Back {
    $items = New-Canvas
    $bmp = $items[0]
    $g = $items[1]

    Draw-CommonBody $g $true

    $stripeBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 112, 65, 31))
    $stripePen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 88, 58, 36)), 18
    foreach ($rect in @(
        (New-Object System.Drawing.Rectangle(990, 1880, 500, 70)),
        (New-Object System.Drawing.Rectangle(955, 2045, 570, 78))
    )) {
        $path = New-Path
        $path.AddArc($rect.X, $rect.Y, 120, $rect.Height, 90, 180)
        $path.AddLine($rect.X + 60, $rect.Bottom, $rect.Right, $rect.Bottom - 18)
        $path.AddLine($rect.Right, $rect.Top + 18, $rect.X + 60, $rect.Top)
        $path.CloseFigure()
        $g.FillPath($stripeBrush, $path)
        $g.DrawPath($stripePen, $path)
        $path.Dispose()
    }
    $spotBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 132, 79, 40))
    $g.FillEllipse($spotBrush, 765, 1985, 112, 80)
    $g.FillEllipse($spotBrush, 1610, 1985, 112, 80)

    $spotBrush.Dispose()
    $stripeBrush.Dispose()
    $stripePen.Dispose()

    $out = Join-Path $outDir "pikachu-pointer-back.png"
    $bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    return $out
}

function Draw-Preview($frontPath, $backPath) {
    $front = [System.Drawing.Image]::FromFile($frontPath)
    $back = [System.Drawing.Image]::FromFile($backPath)
    $bmp = New-Object System.Drawing.Bitmap 2400, 1700, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $bmp.SetResolution(180, 180)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.Clear([System.Drawing.Color]::White)
    $g.DrawImage($front, 120, 80, 1000, 1415)
    $g.DrawImage($back, 1280, 80, 1000, 1415)
    $font = New-Object System.Drawing.Font("Arial", 46, [System.Drawing.FontStyle]::Bold)
    $brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 72, 49, 42))
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = [System.Drawing.StringAlignment]::Center
    $g.DrawString("FRONT", $font, $brush, (New-Object System.Drawing.RectangleF(120, 1510, 1000, 80)), $sf)
    $g.DrawString("BACK", $font, $brush, (New-Object System.Drawing.RectangleF(1280, 1510, 1000, 80)), $sf)
    $out = Join-Path $outDir "pikachu-pointer-preview.png"
    $bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
    $sf.Dispose()
    $brush.Dispose()
    $font.Dispose()
    $g.Dispose()
    $front.Dispose()
    $back.Dispose()
    $bmp.Dispose()
    return $out
}

$frontPath = Draw-Front
$backPath = Draw-Back
$previewPath = Draw-Preview $frontPath $backPath

foreach ($path in @($frontPath, $backPath, $previewPath)) {
    $img = [System.Drawing.Image]::FromFile($path)
    [PSCustomObject]@{
        Path = $path
        Width = $img.Width
        Height = $img.Height
        Dpi = [math]::Round($img.HorizontalResolution)
        Bytes = (Get-Item $path).Length
    }
    $img.Dispose()
}
