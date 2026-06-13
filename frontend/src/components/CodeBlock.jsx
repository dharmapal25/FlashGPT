import { useState, useRef } from 'react';
import { Copy, Check } from 'lucide-react';

const CodeBlock = ({ children, className }) => {
  const [copied, setCopied] = useState(false);
  const preRef = useRef(null);

  // ─── Inline code detect karo ───────────────────────────────────────
  // className hoti hai sirf block code pe (e.g. "language-python")
  // inline <code> pe className nahi hoti → <p> ke andar safely render
  const isInline = !className;

  if (isInline) {
    // ✅ Fix 2: div nahi, seedha <code> → hydration error gone
    return <code className="inlineCode">{children}</code>;
  }

  // ─── Block code ────────────────────────────────────────────────────
  const language = className.replace('language-', '') || 'code';

  const copy = () => {
    // ✅ Fix 1: String(children) nahi — rehype-highlight ne children ko
    // React elements (spans) mein convert kar diya hota hai.
    // preRef.current.textContent se actual raw text milta hai.
    const text = preRef.current?.textContent ?? '';
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="codeWrapper">
      <div className="codeMeta">
        <span className="codeLang">{language}</span>
        <button className="copyCodeBtn" onClick={copy} title="Copy code">
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      {/* ✅ Fix 1: {children} as-is render karo — highlight spans intact rahenge */}
      <pre ref={preRef} className={className}>
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;