# HTML→Screenshot 디자인 템플릿

## HTML 보일러플레이트

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Noto Sans KR', sans-serif; margin: 0; padding: 0; }
  </style>
</head>
<body>
  <!-- 콘텐츠 -->
</body>
</html>
```

## 카드뉴스 (1080x1080)

```html
<div class="w-[1080px] h-[1080px] bg-gradient-to-br from-blue-600 to-purple-700 flex flex-col items-center justify-center p-16 text-white text-center">
  <div class="text-[120px] font-black mb-8">01</div>
  <h2 class="text-5xl font-bold mb-6 leading-tight">핵심 문구를 여기에</h2>
  <p class="text-2xl opacity-80 max-w-[800px]">부가 설명 텍스트</p>
</div>
```

## 비교 카드 (1200x630)

```html
<div class="w-[1200px] h-[630px] bg-white flex">
  <div class="flex-1 bg-red-50 p-12 flex flex-col justify-center">
    <div class="text-red-500 text-xl font-bold mb-4">BEFORE</div>
    <h3 class="text-3xl font-bold text-gray-900 mb-4">이전 방식</h3>
    <ul class="text-xl text-gray-600 space-y-3">
      <li>항목 1</li>
      <li>항목 2</li>
      <li>항목 3</li>
    </ul>
  </div>
  <div class="w-px bg-gray-200"></div>
  <div class="flex-1 bg-green-50 p-12 flex flex-col justify-center">
    <div class="text-green-500 text-xl font-bold mb-4">AFTER</div>
    <h3 class="text-3xl font-bold text-gray-900 mb-4">개선된 방식</h3>
    <ul class="text-xl text-gray-600 space-y-3">
      <li>항목 1</li>
      <li>항목 2</li>
      <li>항목 3</li>
    </ul>
  </div>
</div>
```

## 프로세스 다이어그램 (1200x400)

```html
<div class="w-[1200px] h-[400px] bg-white flex items-center justify-center gap-4 p-12">
  <div class="flex-1 bg-blue-50 rounded-2xl p-8 text-center">
    <div class="text-blue-600 text-lg font-bold mb-2">STEP 1</div>
    <div class="text-xl font-bold text-gray-900">단계 설명</div>
  </div>
  <div class="text-3xl text-gray-300">→</div>
  <div class="flex-1 bg-blue-50 rounded-2xl p-8 text-center">
    <div class="text-blue-600 text-lg font-bold mb-2">STEP 2</div>
    <div class="text-xl font-bold text-gray-900">단계 설명</div>
  </div>
  <div class="text-3xl text-gray-300">→</div>
  <div class="flex-1 bg-blue-50 rounded-2xl p-8 text-center">
    <div class="text-blue-600 text-lg font-bold mb-2">STEP 3</div>
    <div class="text-xl font-bold text-gray-900">단계 설명</div>
  </div>
  <div class="text-3xl text-gray-300">→</div>
  <div class="flex-1 bg-blue-600 rounded-2xl p-8 text-center">
    <div class="text-blue-200 text-lg font-bold mb-2">RESULT</div>
    <div class="text-xl font-bold text-white">최종 결과</div>
  </div>
</div>
```

## 인용/통계 카드 (1200x630)

```html
<div class="w-[1200px] h-[630px] bg-gray-900 flex flex-col items-center justify-center p-16 text-center">
  <div class="text-8xl font-black text-blue-400 mb-6">73%</div>
  <h3 class="text-3xl font-bold text-white mb-4 max-w-[900px] leading-relaxed">핵심 통계에 대한 설명 문구</h3>
  <p class="text-xl text-gray-400">— 출처: 리서치 기관, 2026</p>
</div>
```
