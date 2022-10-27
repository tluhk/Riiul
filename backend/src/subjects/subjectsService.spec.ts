import {Subject} from '../database'
import {addSubject, getPublicSubjects, getSubjects, updateSubject} from './subjectsService'
import {DateTime} from "luxon"
import {subjectsRepository} from '@riiul/repository'
import {findSubjectWithId} from "../database/subjectsRepository"

const SUBJECT_1: Subject = {
  id: 1,
  name: 'subject 1',
  active: true,
  createdAt: DateTime.now(),
  updatedAt: DateTime.now()
}
const SUBJECT_2: Subject = {
  id: 2,
  name: 'subject 2',
  active: true,
  createdAt: DateTime.now(),
  updatedAt: DateTime.now()
}
const SUBJECT_3: Subject = {
  id: 3,
  name: 'subject 3',
  active: true,
  createdAt: DateTime.now(),
  updatedAt: DateTime.now()
}
const SUBJECT_4: Subject = {
  id: 4,
  name: 'subject 4',
  active: false,
  createdAt: DateTime.now(),
  updatedAt: DateTime.now()
}

describe('subjectsService', () => {
  let allSubjectsSpy: jest.SpyInstance
  let allSubjectsPublicSpy: jest.SpyInstance
  let saveSubjectSpy: jest.SpyInstance
  let updateSubjectSpy: jest.SpyInstance
  let findSubjectWithIdSpy: jest.SpyInstance

  beforeEach(() => {
    findSubjectWithIdSpy = jest.spyOn(subjectsRepository, 'findSubjectWithId')
      .mockReturnValue(Promise.resolve(SUBJECT_1))
    saveSubjectSpy = jest.spyOn(subjectsRepository, 'saveSubject').mockImplementation()
    updateSubjectSpy = jest.spyOn(subjectsRepository, 'updateSubject').mockImplementation()
    allSubjectsSpy = jest.spyOn(subjectsRepository, 'getSubjects').mockReturnValue(Promise.resolve(
      [SUBJECT_1, SUBJECT_2, SUBJECT_3, SUBJECT_4]
    ))
    allSubjectsPublicSpy = jest.spyOn(subjectsRepository, 'getPublicSubjects').mockReturnValue(Promise.resolve(
      [SUBJECT_4]
    ))

    jest.mock('@riiul/repository', () => ({
      findSubjectWithId: findSubjectWithIdSpy,
      getSubjects: allSubjectsSpy,
      getPublicSubjects: allSubjectsPublicSpy,
      saveSubjects: saveSubjectSpy,
      updateSubjects: updateSubjectSpy
    }))
  })

  describe('getSubjects', () => {
    it('should return subjects', async () => {
      await expect(getSubjects()).resolves.toEqual([
        { id: 1, name: 'subject 1', active: true },
        { id: 2, name: 'subject 2', active: true },
        { id: 3, name: 'subject 3', active: true },
        { id: 4, name: 'subject 4', active: false },
      ])
    })

  })

  describe('findSubject', () => {
    it('should return subject', async () => {
      it('should return subjects', async () => {
        await expect(findSubjectWithId(1)).resolves.toEqual([{ id: 1, name: 'subject 1'}])
      })
    })
  })

  describe('getPublicSubjects', () => {
    it('should return subjects', async () => {
      await expect(getPublicSubjects()).resolves.toEqual([{ id: 4, name: 'subject 4'}])
    })
  })

  describe('saveSubject', () => {
    it('should return void', async () => {
      const updateBody = { name: 'data', active: true }
      updateSubjectSpy.mockResolvedValue(updateBody)
      await expect(updateSubject(1, updateBody)).resolves.toBeUndefined()

      expect(updateSubjectSpy).toBeCalledWith(1, updateBody)
    })

    it('it should throw subject not found error when no subject is returned from repository', async () => {
      const updateBody = { name: 'data', active: true }
      updateSubjectSpy.mockResolvedValue(undefined)
      await expect(updateSubject(1, updateBody)).rejects.toThrowError("NOT_FOUND")

      expect(updateSubjectSpy).toBeCalledWith(1, updateBody)
    })
  })

  describe('addSubject', () => {
    it('should return void ', async () => {
      const saveBody = { name: 'data', active: true }
      await expect(addSubject(saveBody)).resolves.toBeUndefined()

      expect(saveSubjectSpy).toBeCalledWith(saveBody)
    })
  })
})
