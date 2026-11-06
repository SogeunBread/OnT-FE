import { WheelPicker, WheelPickerWrapper } from "@ncdai/react-wheel-picker";
import { MEAL_TIME_COLUMNS } from "./meal-time-options";
import "@ncdai/react-wheel-picker/style.css";
import "./meal-time-picker.css";

export default function MealTimePicker({ value, onChange, label = "식사 시간" }) {
  return (
    <div className="meal-time-wheels">
      {MEAL_TIME_COLUMNS.map(({ unit, title, options }) => (
        <div
          key={unit}
          className="meal-time-wheel"
          role="group"
          aria-label={`${label} ${title}`}
        >
          <div className="meal-time-wheel-label">{title}</div>
          <WheelPickerWrapper>
            <WheelPicker
              options={options}
              value={unit === "hour" ? value.getHours() : value.getMinutes()}
              onValueChange={(selectedValue) => {
                const next = new Date(value);
                next.setHours(
                  unit === "hour" ? selectedValue : value.getHours(),
                  unit === "minute" ? selectedValue : value.getMinutes(),
                  0,
                  0,
                );
                onChange(next);
              }}
              visibleCount={16}
              optionItemHeight={44}
              scrollSensitivity={1}
            />
          </WheelPickerWrapper>
        </div>
      ))}
    </div>
  );
}
