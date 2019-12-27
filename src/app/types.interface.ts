export interface Articles {
     id: number;
     title: string;
     short_desc: string;
     content: string;
     author: string;
     image: any;
     regDate?: Date;
     newFlag: number;
     created_at: any;
}

export interface Products {
     id: number;
     name: string;
     price: number;
     main_image?: any;
     short_desc: string;
     long_desc: string;
     img_temp1?: any;
     img_temp2?: any;
     img_temp3?: any;
     img_temp4?: any;
     newFlag: number;
     owner_name: string;
     owner_phone: string;
     address: string;
     created_at: any;
}


export interface AuthData {
     userId: number;
     username: string;
     password: string;
     status?: string;
     id?: number;
}

export interface Settings {
     id: number;
     website_title: string;
     slide1_img: any;
     slide1_title: string;
     slide1_desc: string;
     slide2_img: any;
     slide2_title: string;
     slide2_desc: string;
     slide3_img: any;
     slide3_title: string;
     slide3_desc: string;
}