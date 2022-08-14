import { EditorState } from "prosemirror-state";
import Node from "./Node";

export default class Mention extends Node {
  get name() {
    return "mention";
  }

  get schema() {
    return {
      inline: true,
      content: "text*",
      group: "inline",
      atom: true,
      selectable: true,
      attrs: {
        href: {},
        "data-name": {},
      },
      parseDOM: [
        {
          tag: "a.mention",
          getAttrs: (dom: HTMLIFrameElement) => ({
            href: dom.getAttribute("href"),
            "data-name": dom.getAttribute("href"),
          }),
        },
      ],
      toDOM: node => [
        "a",
        { class: "mention", href: node.attrs.href },
        node.attrs["data-name"],
      ],
    };
  }

  commands({ type }) {
    return attrs => (state, dispatch) => {
      const { selection } = state;
      const position = selection.$cursor
        ? selection.$cursor.pos
        : selection.$to.pos;
      const node = type.create(attrs);
      const transaction = state.tr.insert(position, node).insertText(" ");
      dispatch(transaction);

      return true;
    };
  }

  toMarkdown(state, node) {
    state.write(
      "[" +
        state.esc(node.attrs["data-name"]) +
        "](" +
        state.esc(node.attrs.href) +
        ")"
    );
  }

  parseMarkdown() {
    return {
      node: "mention",
      getAttrs: token => ({
        href: token.attrGet("href"),
      }),
    };
  }
}
