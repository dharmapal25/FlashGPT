import React, { useState, useEffect, useRef } from 'react';
import "../style/Multimodels.css";

const Multimodels = () => {
    const [dropdown, setDropdown] = useState(false);
    const [selectedModel, setSelectedModel] = useState(
        localStorage.getItem("model") || "OpenAi-gpt"
    );
    const dropdownRef = useRef(null);

    const modelsList = ["OpenAi-gpt", "llama 3.3", "deepseek-r1", "qwen3.6"];

    function handleSelectModel(modelName) {
        setSelectedModel(modelName);
        localStorage.setItem("model", modelName);
        setDropdown(false);
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className='model-container' ref={dropdownRef}>
            <div className="flashpilot-models" onClick={() => setDropdown(!dropdown)}>
                <div className="model-brand">
                    <span className="brand-title">Flashpilot</span>
                    <span className="current-selected-tag">{selectedModel}</span>
                </div>
                <span className={`dropdown-arrow ${dropdown ? "rotated" : ""}`}>▼</span>
            </div>

            <div className={`select-model ${dropdown ? "openModels" : "closeModels"}`}>
                {modelsList.map((modelName) => (
                    <div
                        key={modelName}
                        className={`model-option ${selectedModel === modelName ? "active-model" : ""}`}
                        onClick={() => handleSelectModel(modelName)}
                    >
                        <span className="model-name-text">{modelName}</span>
                        {selectedModel === modelName && <span className="check-icon">✓</span>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Multimodels;