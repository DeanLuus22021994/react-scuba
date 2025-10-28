Write-Host "`n=== CodeGeeX4: 5 Complex Refactoring Tasks ===" -ForegroundColor Magenta

$results = @()

for ($i = 1; $i -le 5; $i++) {
  Write-Host "`n[$i/5] Refactoring task $i..." -ForegroundColor Cyan
  
  $prompt = switch ($i) {
    1 { "Refactor Python to use type hints and dataclasses: def process_user(name, age, email): return {'name': name, 'age': age, 'email': email}" }
    2 { "Refactor to use list comprehension: def transform(items): result = []; for x in items: if x > 0: result.append(x*2); return result" }
    3 { "Refactor to use context manager: class FileReader: def __init__(self, path): self.path = path; def read(self): f = open(self.path); return f.read()" }
    4 { "Refactor to use functools reduce: def sum_list(nums): total = 0; for n in nums: total += n; return total" }
    5 { "Refactor to use FastAPI and Pydantic: def api_handler(data): user_id = data['id']; return db.query('SELECT * FROM users WHERE id=' + str(user_id))" }
  }
  
  $json = @{
    model   = "codegeex4:9b-all-q4_K_M"
    prompt  = $prompt
    stream  = $false
    options = @{
      num_predict = 1000
      temperature = 0.2
    }
  } | ConvertTo-Json -Depth 3
  
  $json | Out-File -Encoding utf8 "task$i.json"
  
  $start = Get-Date
  $response = curl.exe -s -X POST http://localhost:11434/api/generate -H "Content-Type: application/json" --data-binary "@task$i.json" | ConvertFrom-Json
  $duration = ((Get-Date) - $start).TotalSeconds
  
  $speed = [math]::Round($response.eval_count / $duration, 2)
  
  $results += [PSCustomObject]@{
    Task     = $i
    Tokens   = $response.eval_count
    Duration = [math]::Round($duration, 2)
    Speed    = $speed
  }
  
  Write-Host "  ✓ $($response.eval_count) tokens in $([math]::Round($duration,2))s ($speed tok/s)" -ForegroundColor Green
  
  Remove-Item "task$i.json" -ErrorAction SilentlyContinue
}

Write-Host "`n=== Results ===" -ForegroundColor Magenta
$results | Format-Table -AutoSize

$total = ($results | Measure-Object -Property Tokens -Sum).Sum
$totalTime = [math]::Round(($results | Measure-Object -Property Duration -Sum).Sum, 2)
$avgSpeed = [math]::Round(($results | Measure-Object -Property Speed -Average).Average, 2)

Write-Host "`nTotal: $total tokens in ${totalTime}s | Average: $avgSpeed tok/s" -ForegroundColor Yellow
