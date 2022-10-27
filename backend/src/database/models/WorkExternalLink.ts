import {WorkExternalLinkEnum} from "@riiul/repository"
import {DateTime} from "luxon"

export interface WorkExternalLink {
	id: number
	workId: number
	title: string
	link: string
	type: WorkExternalLinkEnum
	createdAt: DateTime
	updatedAt: DateTime
}
