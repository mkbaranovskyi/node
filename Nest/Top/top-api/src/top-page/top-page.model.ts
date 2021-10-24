export enum TopLevelCatetoryEnum {
  Courses,
  Services,
  Books,
  Products,
}

export class TopPageModel {
  _id: string
  firstCategory: TopLevelCatetoryEnum
  secondCategory: string
  title: string
  category: string
  hh?: {
    jobCount: number
    juniorSalary: number
    middleSalary: number
    seniorSalary: number
  }
  advantages: {
    title: string
    description: string
  }[]
  seoText: string
  tagsTitle: string
  tags: string[]
}
