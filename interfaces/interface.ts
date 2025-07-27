export interface ListClass {
  className?: string;
}

export interface DEF {
  id: number;
  name: string;
  address: string;

  listClass?: ListClass;
}

export interface ABC {
  id: number;
  name: string;
  listFriends?: DEF[];
}
