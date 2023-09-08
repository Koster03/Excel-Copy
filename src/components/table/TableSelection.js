export class TableSelection {
  static className = "selected";

  constructor() {
    this.group = [];
  }

  select($el) {
    this.clear();
    this.group.push($el);
    $el.addClass(TableSelection.className);
  }

  selectGroup(group) {
    this.clear();
    this.group = group;
    group.forEach(element => {
      element.addClass(TableSelection.className);
    });
  }

  clear() {
    this.group.forEach((el) => el.removeClass(TableSelection.className));
    this.group = [];
  }
}