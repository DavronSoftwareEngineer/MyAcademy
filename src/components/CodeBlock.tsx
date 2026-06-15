import { useState } from "react";
import { highlight } from "../lib/highlight";
import { copyText } from "../lib/storage";
import { useStore } from "../store";
import type { CodeBlock as CB } from "../types";

export function CodeBlock({ block }: { block: CB }) {
  const [done, setDone] = useState(false);
  const [vi, setVi] = useState(0);
  const { toast } = useStore();

  const variants = block.variants && block.variants.length > 0 ? block.variants : null;
  const idx = variants ? Math.min(vi, variants.length - 1) : 0;
  const active = variants ? variants[idx] : { label: "", lang: block.lang, code: block.code };

  const onCopy = async () => {
    await copyText(active.code);
    setDone(true);
    toast("Kod nusxalandi");
    setTimeout(() => setDone(false), 1600);
  };

  return (
    <>
      {block.heading && (block.heading.h || block.heading.p) && (
        <div className="prose">
          {block.heading.h && <h3>{block.heading.h}</h3>}
          {block.heading.p && <p>{block.heading.p}</p>}
        </div>
      )}
      <div className="codewrap">
        <div className="codehead">
          <span className="fn">{block.title}</span>
          <div className="codehead-right">
            {variants && (
              <div className="codelang-switch" role="group" aria-label="Til">
                {variants.map((v, i) => (
                  <button
                    key={v.label}
                    className={"clbtn" + (i === idx ? " active" : "")}
                    onClick={() => setVi(i)}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            )}
            <span className="lang">{active.lang}</span>
            <button className={"copybtn" + (done ? " done" : "")} onClick={onCopy}>
              {done ? "Nusxalandi" : "Nusxa"}
            </button>
          </div>
        </div>
        <pre>
          <code dangerouslySetInnerHTML={{ __html: highlight(active.code, active.lang) }} />
        </pre>
      </div>
    </>
  );
}
