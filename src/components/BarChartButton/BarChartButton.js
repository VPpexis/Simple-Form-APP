import { RadioButtonUnchecked } from "@mui/icons-material";
import './BarChartButton.css';
import { useState } from "react";

export default function BarChartButton () {
    const [expand, setExpand] = useState(false);
    const toggleExpand = () => setExpand((prevExpand) => !prevExpand);

    return (
        <div className="buttonStyle">
            <button onClick={toggleExpand}>sample <span>+</span></button>
            {expand && <div className="content">content</div>}
        </div>
    );
}