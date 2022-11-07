export interface AddClientFacadeInputDto {
  id?: string;
  name: string;
  document: string;
  email: string;
  street: string;
  complement: string;
  number: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface FindClientFacadeInputDto {
  id: string;
}

export interface FindClientFacadeOutputDto {
  id: string;
  name: string;
  document: string;
  email: string;
  street: string;
  complement: string;
  number: string;
  city: string;
  state: string;
  zipCode: string;
  createdAt: Date;
  updatedAt: Date;
}

export default interface ClientAdmFacadeInterface {
  add(input: AddClientFacadeInputDto): Promise<void>;
  find(input: FindClientFacadeInputDto): Promise<FindClientFacadeOutputDto>;
}
