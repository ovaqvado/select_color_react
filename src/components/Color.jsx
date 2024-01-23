import React, { useState, useEffect } from 'react';
import './Color.css'

const ColorPalette = () => {
  const initialColors = [
    { name: "Red", type: "RGB", code: "255,0,0" },
    { name: "Blue", type: "RGBA", code: "0,0,255,0.5" },
    { name: "Green", type: "HEX", code: "#00FF00" }
  ];

  const [colors, setColors] = useState(initialColors);
  const [newColor, setNewColor] = useState({ name: "", type: "RGB", code: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Save colors in cookies
    document.cookie = `colors=${JSON.stringify(colors)}; max-age=${3 * 60 * 60}`;
  }, [colors]);

  const handleInputChange = (e) => {
    setNewColor({ ...newColor, [e.target.name]: e.target.value });
  };

  const handleSaveColor = () => {
    let error = {};
    if (!newColor.name) {
      error.name = "Name is required";
    } else if (colors.some(color => color.name.toLowerCase() === newColor.name.toLowerCase())) {
      error.name = "Name must be unique";
    } else if (!/^[a-zA-Z]+$/.test(newColor.name)) {
      error.name = "Name can only contain alphabetical characters";
    }

    if (newColor.type === "RGB") {
      const rgbValues = newColor.code.split(",");
      if (rgbValues.length !== 3 || rgbValues.some(val => isNaN(val) || val < 0 || val > 255)) {
        error.code = "Invalid RGB value";
      }
    } else if (newColor.type === "RGBA") {
      const rgbaValues = newColor.code.split(",");
      if (rgbaValues.length !== 4 || rgbaValues.slice(0, 3).some(val => isNaN(val) || val < 0 || val > 255) || rgbaValues[3] < 0 || rgbaValues[3] > 1) {
        error.code = "Invalid RGBA value";
      }
    } else if (newColor.type === "HEX") {
      if (!/^#([A-Fa-f0-9]{6})$/.test(newColor.code)) {
        error.code = "Invalid HEX value";
      }
    }

    if (Object.keys(error).length === 0) {
      setColors([...colors, newColor]);
      setNewColor({ name: "", type: "RGB", code: "" });
      setErrors({});
    } else {
      setErrors(error);
    }
  };

        return (
            <div className='Say'>
              <h2>Color Palette</h2>
              {colors.map((color, index) => (
                <div key={index}>
                  <span style={{ backgroundColor: color.type === "HEX" ? color.code : `rgba(${color.code})`, padding: "8px" }}>{color.name}</span>
                </div>
              ))}
              <h3>Add New Color</h3>
              <div>
                <label>Name:</label>
                <input type="text" name="name" value={newColor.name} onChange={handleInputChange} />
                {errors.name && <span>{errors.name}</span>}
              </div>
              <div>
                <label>Type:</label>
                <select name="type" value={newColor.type} onChange={handleInputChange}>
                  <option value="RGB">RGB</option>
                  <option value="RGBA">RGBA</option>
                  <option value="HEX">HEX</option>
                </select>
              </div>
              <div>
                <label>Code:</label>
                <input type="text" name="code" value={newColor.code} onChange={handleInputChange} />
                {errors.code && <span>{errors.code}</span>}
              </div>
              <button onClick={handleSaveColor}>Save</button>
            </div>
          );
        };
        
        export default ColorPalette;