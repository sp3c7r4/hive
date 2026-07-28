# Dashboard Responsive Convention

Apply these rules to every dashboard (Student / Instructor / Parent / Admin) — proactively, not reactively.

## 1. Layout shell: `min-w-0` + `overflow-x-hidden`
On the main content wrapper in `DashboardLayout`, non-negotiable:
```tsx
<main className="flex-1 flex flex-col min-h-screen min-w-0 overflow-x-hidden">
```

## 2. Dashboard outer wrapper: `min-w-0`
Every dashboard's outermost `<div ref={containerRef}>`:
```tsx
<div ref={containerRef} className="flex flex-col gap-6 min-w-0">
```

## 3. Card grids: mobile-first
Never ship a bare `grid-cols-3`. Always start from `grid-cols-1`:
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
```

## 4. Horizontal-scroll carousels: `min-w-0` on wrapper
`ScrollArea` + `whitespace-nowrap` needs `min-w-0` on its own wrapper:
```tsx
<div className="dash-widget min-w-0">
  <ScrollArea className="w-full min-w-0 whitespace-nowrap">
    ...
  </ScrollArea>
</div>
```

## 5. `justify-between` rows: stack on mobile
Any row with text + action (button/badge/link) using `justify-between`:
```tsx
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
```
Buttons inside get `w-full sm:w-auto shrink-0`.

## 6. TabsList with 3+ triggers: horizontal scroll
```tsx
<div className="overflow-x-auto -mx-1 px-1">
  <TabsList className="w-max">
    <!-- or a plain div with flex + w-max for custom pill filters -->
  </TabsList>
</div>
```

## 7. Recharts charts: `overflow-hidden` + `min-w-0`
```tsx
<Card className="overflow-hidden">
  <ChartContainer config={config} className="h-[200px] w-full min-w-0">
    ...
  </ChartContainer>
</Card>
```
If tooltips escape, check the `min-w-0` chain first before adding one-off fixes.

## 8. Test every widget at 375px
Before considering any dashboard widget done, test it at 375px viewport width.
