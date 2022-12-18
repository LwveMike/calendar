export class MonthNode {
  public data: Date
  private dateGrid: Date[] = []
  private next: MonthNode | null
  private previous: MonthNode | null

  constructor (data: Date) {
    this.data = new Date(data.getFullYear(), data.getMonth(), 1)
    this.createGrid()
    this.next = null
    this.previous = null
  }

  hasNext (): boolean { return this.next !== null }
  hasPrevious (): boolean { return this.previous !== null }

  get getNext (): MonthNode | null { return this.next }
  get getPrevious (): MonthNode | null { return this.previous }

  set setNext (dateNode: MonthNode) { this.next = dateNode }
  set setPrevious (dateNode: MonthNode) { this.previous = dateNode}

  get getDateGrid () { return this.dateGrid }

  createGrid () {
    let cursor = this.data.getDay()
    const length = cursor + new Date(this.data.getFullYear(), this.data.getMonth() + 1, 0).getDate()
    let dayCounter = 1
    while (cursor < length) {
      this.dateGrid[cursor] = new Date(this.data.getFullYear(), this.data.getMonth(), dayCounter)
      dayCounter += 1
      cursor += 1
    }
  }
}

interface CurrentMonths {
  left: MonthNode,
  right: MonthNode
}

export class Calendar {
  public currentDisplayed: CurrentMonths

  constructor () {
    const today = new Date()
    this.currentDisplayed = {
      right: new MonthNode(today),
      left: new MonthNode(new Date(today.getFullYear(), today.getMonth() - 1))
    }

    this.currentDisplayed.right.setPrevious = this.currentDisplayed.left
    this.currentDisplayed.left.setNext = this.currentDisplayed.right
  }

  append (date: Date) {
    const dateNode = new MonthNode(date)
    dateNode.setPrevious = this.currentDisplayed.right
    this.currentDisplayed.right.setNext = dateNode
    this.currentDisplayed.left = this.currentDisplayed.right
    this.currentDisplayed.right = this.currentDisplayed.right.getNext as MonthNode
  }

  appendIfDoesntExist () {
    if (this.currentDisplayed.right.hasNext()) {
      this.currentDisplayed.left = this.currentDisplayed.right
      this.currentDisplayed.right = this.currentDisplayed.right.getNext as MonthNode
    } else {
      const date = new Date(this.currentDisplayed.right.data.getFullYear(), this.currentDisplayed.right.data.getMonth() + 1, 1)
      this.append(date)
    }
  }

  prepend (date: Date) {
    const dateNode = new MonthNode(date)
    dateNode.setNext = this.currentDisplayed.left
    this.currentDisplayed.left.setPrevious = dateNode
    this.currentDisplayed.right = this.currentDisplayed.left
    this.currentDisplayed.left = this.currentDisplayed.left.getPrevious as MonthNode
  }

  prependIfDoesntExist () {
    if (this.currentDisplayed.left.hasPrevious()) {
      this.currentDisplayed.right = this.currentDisplayed.left
      this.currentDisplayed.left = this.currentDisplayed.left.getPrevious as MonthNode
    } else {
      const date = new Date(this.currentDisplayed.left.data.getFullYear(), this.currentDisplayed.left.data.getMonth() - 1, 1)
      this.prepend(date)
    }
  }
}
