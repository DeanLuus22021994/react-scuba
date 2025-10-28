$prompts = @(
  "Write a Python function to calculate factorial",
  "Create a React component for a button",
  "Implement binary search in JavaScript"
)

$results = @()

foreach ($prompt in $prompts) {
  Write-Host "`n=== Testing: $prompt ===" -ForegroundColor Cyan
  $start = Get-Date
  
  try {
    $body = @{
      model  = "codegeex4:9b-all-q4_K_M"
      prompt = $prompt
      stream = $false
    }
    
    $response = Invoke-RestMethod -Uri "http://localhost:11434/api/generate" -Method POST -Body ($body | ConvertTo-Json) -ContentType "application/json"
    
    $end = Get-Date
    $duration = ($end - $start).TotalSeconds
    
    $results += [PSCustomObject]@{
      Prompt         = $prompt.Substring(0, [Math]::Min(40, $prompt.Length))
      Tokens         = $response.eval_count
      Duration_Sec   = [math]::Round($duration, 2)
      Tokens_Per_Sec = [math]::Round($response.eval_count / $duration, 2)
      Load_Time_Sec  = [math]::Round($response.load_duration / 1000000000, 2)
    }
    
    Write-Host "Tokens: $($response.eval_count) | Duration: $([math]::Round($duration,2))s | Speed: $([math]::Round($response.eval_count/$duration,2)) tok/s" -ForegroundColor Yellow
  }
  catch {
    Write-Host "ERROR: $_" -ForegroundColor Red
    Write-Host "Exception: $($_.Exception.Message)" -ForegroundColor Red
  }
}

Write-Host "`n=== BENCHMARK RESULTS ===" -ForegroundColor Magenta
$results | Format-Table -AutoSize
