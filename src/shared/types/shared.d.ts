export interface INameIdEntity {
  id: number;
  name: string;
}
export type INamedDiscipline = INameIdEntity;

export type INamedContestType = INameIdEntity;

export interface ISelectOption {
  value: string;
  label: string;
}

export interface UISelectOption extends ISelectOption {
  isContainerStyle?: boolean;
  inlineLevel?: number;
}

export interface ICategoryItem {
  title: string;
  options: UISelectOption[];
  selectedValue: string;
}

// export interface ISelectedCategoryItem {
//   index: number;
//   value: string;
// }
