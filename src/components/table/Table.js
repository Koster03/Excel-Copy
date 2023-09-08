import { ExcelComponent } from "../../core/ExcelComponent";
import { $ } from "../../core/dom";
import { TableSelection } from "./TableSelection";
import { shouldResize, shouldSelect } from "./table.functions";
import { resizeHandler } from "./table.resize";
import { createTable } from "./table.template";

export class Table extends ExcelComponent {
  static className = "excel__table";

  constructor($root) {
    super($root, {
      listeners: ["mousedown", "mouseup"],
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

    const $cell = this.$root.find('[data-id="0:0"]');
    this.selection.select($cell);
  }

  onMousedown(event) {
    this.selection.clear();
    if (!event.shiftKey) {
      if (shouldSelect(event)) {
        this.selection.select($(event.target));
      }
    } else {
      this.startSelectedCell = event.target.dataset.id;
      console.log(this.startSelectedCell);
    }

    if (shouldResize(event)) {
      resizeHandler(this.$root, event);
    }
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
}
