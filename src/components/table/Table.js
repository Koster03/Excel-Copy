import { ExcelComponent } from "../../core/ExcelComponent";
import { $ } from "../../core/dom";
import { TableSelection } from "./TableSelection";
import { nextSelector, shouldResize, shouldSelect } from "./table.functions";
import { resizeHandler } from "./table.resize";
import { createTable } from "./table.template";

export class Table extends ExcelComponent {
  static className = "excel__table";

  constructor($root, options) {
    super($root, {
      name: "Table",
      listeners: ["mousedown", "mouseup", "keydown", 'input'],
      ...options,
    });
  }

  toHTML() {
    return createTable(20);
  }

  prepare() {
    this.selection = new TableSelection();
  }

  init() {
    super.init();
    this.$on("formula:input", (text) => {
      this.selection.current.text(text);
    });
    this.$on("formula:done", () => {
      this.selection.current.focus();
    });
    const $cell = this.$root.find('[data-id="0:0"]');
    this.selectCell($cell);
  }

  onMousedown(event) {
    this.selection.clear();
    if (!event.shiftKey) {
      if (shouldSelect(event)) {
        this.selectCell($(event.target));
      }
    } else {
      this.startSelectedCell = event.target.dataset.id;
      console.log(this.startSelectedCell);
    }

    if (shouldResize(event)) {
      resizeHandler(this.$root, event);
    }
  }

  selectCell($cell) {
    this.selection.select($cell);
    this.$emit("table:select", $cell);
  }

  onMouseup(event) {
    if (event.shiftKey) {
      const endSelectedCell = event.target.dataset.id;
      let startRow = +this.startSelectedCell.split(":")[0];
      let endRow = +endSelectedCell.split(":")[0];
      let startCol = +this.startSelectedCell.split(":")[1];
      let endCol = +endSelectedCell.split(":")[1];

      const rstartRow = Math.min(startRow, endRow);
      const rendRow = Math.max(startRow, endRow);
      const rstartCol = Math.min(startCol, endCol);
      const rendCol = Math.max(startCol, endCol);

      let selectedGroup = [];
      for (let row = rstartRow; row <= rendRow; row++) {
        for (let col = rstartCol; col <= rendCol; col++) {
          const dada = this.$root.find(`[data-id="${row}:${col}"]`);
          selectedGroup.push(dada);
        }
      }

      this.selection.selectGroup(selectedGroup);
    }
  }

  onInput(event) {
    this.$emit('table:input', $(event.target))
  }

  onKeydown(event) {
    const keys = [
      "Enter",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "ArrowDown",
      "ArrowUp",
    ];

    const { key } = event;

    if (keys.includes(key) && !event.shiftKey) {
      event.preventDefault();
      const id = this.selection.current.id(true);
      const $next = this.$root.find(nextSelector(key, id));
      this.selectCell($next);
    }
  }
}
