import { useEffect } from "react";

export function Seo(props: { title: string; description?: string }) {
  useEffect(() => {
    document.title = props.title;

    if (props.description) {
      let el = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.name = "description";
        document.head.appendChild(el);
      }
      el.content = props.description;
    }
  }, [props.title, props.description]);

  return null;
}
