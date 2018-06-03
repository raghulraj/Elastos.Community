import BaseRedux from '@/model/BaseRedux';

class UserRedux extends BaseRedux {
    defineTypes() {
        return ['user'];
    }

    defineDefaultState() {
        return {
            is_login: false,
            is_admin: false,

            username: '',

            role: '',

            login_form: {
                username: '',
                password: '',
                loading: false
            },

            register_form: {
                step: 1,
                firstName: '',
                lastName: '',
                email: '',
                password: ''
            },

            profile: {

            },
            current_user_id: null
        };
    }
}

export default new UserRedux()
