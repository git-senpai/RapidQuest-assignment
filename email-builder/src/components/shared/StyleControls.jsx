const StyleControls = ({ section, styles, handleStyleChange }) => (
  <div className="grid grid-cols-2 gap-2 mt-2 p-2 bg-gray-100 rounded">
    <div>
      <label className="block text-xs mb-1">Font Size</label>
      <select
        value={styles[section].fontSize}
        onChange={(e) => handleStyleChange(section, "fontSize", e.target.value)}
        className="w-full p-1 border rounded text-sm"
      >
        {["12px", "14px", "16px", "18px", "20px", "24px", "28px", "32px"].map(
          (size) => (
            <option key={size} value={size}>
              {size}
            </option>
          )
        )}
      </select>
    </div>
    <div>
      <label className="block text-xs mb-1">Font Family</label>
      <select
        value={styles[section].fontFamily}
        onChange={(e) =>
          handleStyleChange(section, "fontFamily", e.target.value)
        }
        className="w-full p-1 border rounded text-sm"
      >
        {["Arial", "Times New Roman", "Helvetica", "Georgia", "Verdana"].map(
          (font) => (
            <option key={font} value={font}>
              {font}
            </option>
          )
        )}
      </select>
    </div>
    <div>
      <label className="block text-xs mb-1">Text Color</label>
      <input
        type="color"
        value={styles[section].color}
        onChange={(e) => handleStyleChange(section, "color", e.target.value)}
        className="w-full p-1 border rounded"
      />
    </div>
    <div>
      <label className="block text-xs mb-1">Background</label>
      <input
        type="color"
        value={
          styles[section].backgroundColor === "transparent"
            ? "#ffffff"
            : styles[section].backgroundColor
        }
        onChange={(e) =>
          handleStyleChange(section, "backgroundColor", e.target.value)
        }
        className="w-full p-1 border rounded"
      />
    </div>
    <div>
      <label className="block text-xs mb-1">Alignment</label>
      <select
        value={styles[section].textAlign}
        onChange={(e) =>
          handleStyleChange(section, "textAlign", e.target.value)
        }
        className="w-full p-1 border rounded text-sm"
      >
        {["left", "center", "right", "justify"].map((align) => (
          <option key={align} value={align}>
            {align}
          </option>
        ))}
      </select>
    </div>
    <div>
      <label className="block text-xs mb-1">Padding</label>
      <select
        value={styles[section].padding}
        onChange={(e) => handleStyleChange(section, "padding", e.target.value)}
        className="w-full p-1 border rounded text-sm"
      >
        {["5px", "10px", "15px", "20px", "25px", "30px"].map((padding) => (
          <option key={padding} value={padding}>
            {padding}
          </option>
        ))}
      </select>
    </div>
    {section === "content" && (
      <div>
        <label className="block text-xs mb-1">Line Height</label>
        <select
          value={styles.content.lineHeight}
          onChange={(e) =>
            handleStyleChange("content", "lineHeight", e.target.value)
          }
          className="w-full p-1 border rounded text-sm"
        >
          {["1", "1.2", "1.5", "1.8", "2"].map((height) => (
            <option key={height} value={height}>
              {height}
            </option>
          ))}
        </select>
      </div>
    )}
  </div>
);

export default StyleControls;
