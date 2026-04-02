export type Employee = {
  id: string
  name: string
  department: string
  startDate: string
  salary: number
  active: boolean
}

export const departments = [
  { value: "engineering", label: "Engineering" },
  { value: "design", label: "Design" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
  { value: "hr", label: "Human Resources" },
  { value: "finance", label: "Finance" },
]

export const initialEmployees: Employee[] = [
  {
    id: "EMP-001",
    name: "Alice Johnson",
    department: "engineering",
    startDate: "2022-03-15",
    salary: 95000,
    active: true,
  },
  {
    id: "EMP-002",
    name: "Bob Smith",
    department: "design",
    startDate: "2021-07-01",
    salary: 82000,
    active: true,
  },
  {
    id: "EMP-003",
    name: "Carol Williams",
    department: "marketing",
    startDate: "2023-01-10",
    salary: 75000,
    active: false,
  },
  {
    id: "EMP-004",
    name: "David Brown",
    department: "sales",
    startDate: "2020-11-20",
    salary: 68000,
    active: true,
  },
  {
    id: "EMP-005",
    name: "Eva Martinez",
    department: "hr",
    startDate: "2022-09-05",
    salary: 72000,
    active: true,
  },
  {
    id: "EMP-006",
    name: "Frank Lee",
    department: "finance",
    startDate: "2021-04-12",
    salary: 88000,
    active: true,
  },
  {
    id: "EMP-007",
    name: "Grace Chen",
    department: "engineering",
    startDate: "2023-06-18",
    salary: 102000,
    active: true,
  },
  {
    id: "EMP-008",
    name: "Henry Davis",
    department: "design",
    startDate: "2022-12-01",
    salary: 79000,
    active: false,
  },
]
