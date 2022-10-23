import {DateTime} from "luxon";

export interface Tag {
	id: number
	name: string
	createdAt: DateTime
	updatedAt: DateTime
}

