import BaseType from './BaseType'

type WorkDatabaseType = BaseType & {
	subject_id: number
	title: string
	description: string
	priority: boolean
	active: boolean
	graduation_year?: number
	is_video_preview_image: boolean
}

export default WorkDatabaseType
