<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificate Of Achievement</title>
    <style>
        @page {
            size: A4 landscape;
            margin: 0;
        }
        body {
            font-family: 'Inter', system-ui, sans-serif;
            background-color: #f8fafc;
            color: #1e293b;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
        }
        .certificate-container {
            width: 1040px;
            height: 720px;
            background: white;
            position: relative;
            border: 40px solid transparent;
            border-image: linear-gradient(to bottom right, #4f46e5, #818cf8) 1;
            padding: 40px;
            box-sizing: border-box;
            box-shadow: 0 50px 100px -20px rgba(0,0,0,0.1);
        }
        .decorative-elements {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            overflow: hidden;
            pointer-events: none;
            z-index: 0;
        }
        .circle-1 {
            position: absolute; top: -100px; right: -100px;
            width: 300px; height: 300px;
            background: #eef2ff; border-radius: 50%;
        }
        .circle-2 {
            position: absolute; bottom: -50px; left: -50px;
            width: 200px; height: 200px;
            background: #f1f5f9; border-radius: 50%;
        }
        .content {
            position: relative;
            z-index: 10;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 52px;
            font-weight: 900;
            color: #1e1b4b;
            text-transform: uppercase;
            letter-spacing: -2px;
        }
        .header p {
            font-size: 18px;
            font-weight: 600;
            color: #6366f1;
            margin-top: 5px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        .present-text {
            margin-top: 40px;
            font-style: italic;
            font-size: 20px;
            color: #64748b;
        }
        .recipient-name {
            margin: 20px 0;
            font-size: 48px;
            font-weight: 800;
            color: #1e293b;
            border-bottom: 2px solid #e2e8f0;
            display: inline-block;
            padding: 0 40px 5px;
        }
        .achievement-text {
            margin: 30px auto;
            max-width: 600px;
            font-size: 18px;
            line-height: 1.6;
            color: #475569;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin-top: 40px;
            padding: 0 50px;
        }
        .stat-card {
            background: #f8fafc;
            padding: 20px;
            border-radius: 20px;
            border: 1px solid #f1f5f9;
        }
        .stat-label {
            font-size: 10px;
            font-weight: 900;
            text-transform: uppercase;
            color: #94a3b8;
            letter-spacing: 1px;
            margin-bottom: 5px;
        }
        .stat-value {
            font-size: 24px;
            font-weight: 800;
            color: #4f46e5;
        }
        .footer-info {
            margin-top: 60px;
            display: flex;
            justify-content: space-around;
            align-items: flex-end;
        }
        .signature-box {
            text-align: center;
        }
        .signature-line {
            width: 200px;
            height: 1px;
            background: #cbd5e1;
            margin-bottom: 10px;
        }
        .signature-text {
            font-size: 14px;
            font-weight: 700;
            color: #1e293b;
        }
        .seal {
            width: 80px; height: 80px;
            background: #4f46e5;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            font-weight: 900;
            box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.4);
        }
    </style>
</head>
<body>
    <div class="certificate-container">
        <div class="decorative-elements">
            <div class="circle-1"></div>
            <div class="circle-2"></div>
        </div>
        <div class="content">
            <div class="header">
                <h1>Certificate</h1>
                <p>Of Achievement</p>
            </div>
            
            <p class="present-text">This is proudly presented to</p>
            <div class="recipient-name">{{ $attempt->user?->name ?? 'Guest' }}</div>
            
            <p class="achievement-text">
                For the successful completion of the <strong>{{ $attempt->test?->name ?? 'Exam' }}</strong> mock exam 
                on our platform with an overall performance evaluated as <strong>{{ $attempt->level ?? 'N/A' }}</strong>.
            </p>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-label">Overall Score</div>
                    <div class="stat-value">{{ $attempt->score ?? 0 }}/75</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">CEFR Level</div>
                    <div class="stat-value">{{ $attempt->level ?? 'N/A' }}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Attempt Date</div>
                    <div class="stat-value" style="font-size: 14px;">{{ $attempt->created_at?->format('M d, Y') ?? 'N/A' }}</div>
                </div>
                <div class="stat-card" style="background: #4f46e5;">
                    <div class="stat-label" style="color: #c7d2fe;">Status</div>
                    <div class="stat-value" style="color: white; font-size: 18px;">Verified</div>
                </div>
            </div>

            <div class="footer-info">
                <div class="signature-box">
                    <div class="signature-line"></div>
                    <div class="signature-text">Platform Director</div>
                </div>
                
                <div class="seal">M</div>

                <div class="signature-box">
                    <div class="signature-line"></div>
                    <div class="signature-text">AI Examiner System</div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
