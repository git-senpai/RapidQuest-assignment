import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/email-builder/Home";
import TechnicalMode from "./pages/email-builder/TechnicalMode";
import NonTechnicalMode from "./pages/email-builder/NonTechnicalMode";
import TemplateEditor from "./pages/email-builder/TemplateEditor";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tools" element={<TechnicalMode />} />
        <Route path="/non-tech" element={<NonTechnicalMode />} />
        <Route path="/template-editor" element={<TemplateEditor />} />
      </Routes>
    </Router>
  );
}

export default App;
