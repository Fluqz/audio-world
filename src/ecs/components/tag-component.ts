import { Component } from "./component";

export class TagComponent implements Component {

    tagName: string

    constructor(tagName: string) {

        this.tagName = tagName
    }
}
