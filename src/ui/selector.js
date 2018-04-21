

const masks = {
  text: 0x01,
  textContains: 0x02,
  textMatches: 0x04,
  textStartsWith: 0x08,
  className: 0x10,
  classNameMatches: 0x20,
  description: 0x40,
  descriptionContains: 0x80,
  descriptionMatches: 0x0100,
  descriptionStartsWith: 0x0200,
  checkable: 0x0400,
  checked: 0x0800,
  clickable: 0x1000,
  longClickable: 0x2000,
  scrollable: 0x4000,
  enabled: 0x8000,
  focusable: 0x010000,
  focused: 0x020000,
  selected: 0x040000,
  packageName: 0x080000,
  packageNameMatches: 0x100000,
  resourceId: 0x200000,
  resourceIdMatches: 0x400000,
  index: 0x800000,
  instance: 0x01000000,
};

class Selector {
  constructor(fields) {
    this.mask = 0;
    Object.keys(fields).forEach((field) => {
      const value = fields[field];
      if (value) {
        this.mask = this.mask || masks[field];
      }
      if (field === 'childOrSiblingSelector') {
        this[field] = new Selector(fields[field]);
      }
      this[field] = value;
    });
  }
}

export default Selector;
