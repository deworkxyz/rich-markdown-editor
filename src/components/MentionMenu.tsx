import React, { ReactNode } from "react";
import FuzzySearch from "fuzzy-search";
import CommandMenu, { Props } from "./CommandMenu";
import BlockMenuItem from "./BlockMenuItem";

export interface Mentionable {
  id: string;
  title: string;
  href: string;
  name: "mention";
  children?: ReactNode;
  attrs: { href: string; "data-name": string };
}

class MentionMenu extends React.Component<
  Omit<
    Props<Mentionable>,
    "renderMenuItem" | "onLinkToolbarOpen" | "embeds" | "onClearSearch"
  >
> {
  get items(): Mentionable[] {
    const query = this.props.search?.toLowerCase() ?? "";
    const searcher = new FuzzySearch<Mentionable>(this.props.items, ["title"], {
      caseSensitive: false,
      sort: true,
    });

    return searcher.search(query).slice(0, 10);
  }

  clearSearch = () => {
    const { state, dispatch } = this.props.view;

    // clear search input
    dispatch(
      state.tr.insertText(
        "",
        state.selection.$from.pos - (this.props.search ?? "").length - 1,
        state.selection.to
      )
    );
  };

  render() {
    return (
      <CommandMenu
        {...this.props}
        id="mention-menu-container"
        filterable={false}
        onClearSearch={this.clearSearch}
        renderMenuItem={(item, _index, options) => (
          <BlockMenuItem
            title={item.children ?? item.title}
            selected={options.selected}
            onClick={options.onClick}
          />
        )}
        items={this.items}
      />
    );
  }
}

export default MentionMenu;
