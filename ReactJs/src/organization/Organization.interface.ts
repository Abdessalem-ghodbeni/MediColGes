export interface Organization {
    _id: string;
    name: string;
    description: string;
    category_id: string;
    website: string;
    contact: {
        email: string;
        phone: string;
        address: string;
    };
}

// export default Organization;