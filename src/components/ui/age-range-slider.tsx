"use client";

interface AgeRangeSliderProps {
  min: number | null;
  max: number | null;
  onChange: (min: number | null, max: number | null) => void;
  /** Lower bound for the slider. Default: 18 */
  minBound?: number;
  /** Upper bound for the slider. Default: 65 */
  maxBound?: number;
}

export function AgeRangeSlider({
  min,
  max,
  onChange,
  minBound = 18,
  maxBound = 65,
}: AgeRangeSliderProps) {
  const minVal = min ?? minBound;
  const maxVal = max ?? maxBound;

  return (
    <div className="space-y-3 px-1">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-white/80">{minVal}</span>
        <span className="text-[11px] text-white/35">to</span>
        <span className="text-sm font-medium text-white/80">{maxVal}</span>
      </div>
      <div className="space-y-2.5">
        <div className="flex items-center gap-2">
          <span className="w-7 text-[10px] text-white/28 tabular-nums">{minBound}</span>
          <input
            type="range"
            min={minBound}
            max={maxBound}
            value={minVal}
            onChange={(e) => {
              const next = Number(e.target.value);
              onChange(next, Math.max(next + 1, maxVal));
            }}
            className="bd-age-range flex-1"
          />
          <span className="w-7 text-right text-[10px] text-white/28 tabular-nums">{maxBound}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-7 text-[10px] text-white/28 tabular-nums">{minBound}</span>
          <input
            type="range"
            min={minBound}
            max={maxBound}
            value={maxVal}
            onChange={(e) => {
              const next = Number(e.target.value);
              onChange(Math.min(minVal, next - 1), next);
            }}
            className="bd-age-range flex-1"
          />
          <span className="w-7 text-right text-[10px] text-white/28 tabular-nums">{maxBound}</span>
        </div>
      </div>
      <style>{`
        .bd-age-range {
          -webkit-appearance: none;
          appearance: none;
          height: 3px;
          background: rgba(255,255,255,0.09);
          border-radius: 9999px;
          outline: none;
          cursor: pointer;
          width: 100%;
        }
        .bd-age-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #d4688a, #b48cff);
          cursor: pointer;
          border: 2px solid rgba(180,140,255,0.3);
          box-shadow: 0 2px 8px rgba(180,140,255,0.3);
        }
        .bd-age-range::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #d4688a, #b48cff);
          cursor: pointer;
          border: 2px solid rgba(180,140,255,0.3);
          box-shadow: none;
        }
      `}</style>
    </div>
  );
}
