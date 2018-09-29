import {createContainer, goPath} from '@/util'
import Component from './Component'
import UserService from '@/service/UserService'
import {message} from 'antd'

message.config({
    top: 100
})

/**
 * Note at the moment we do lazy client side registration code generation
 * TODO: move this to server side
 */
export default createContainer(Component, (state) => {

    return {
        ...state.user.register_form,
        language: state.language
    }
}, () => {
    const userService = new UserService()

    return {
        async changeStep(step) {
            await userService.changeStep(step)
        },

        async register(username, password, profile) {
            try {
                const rs = await userService.register(username, password, profile)

                if (rs) {
                    userService.sendConfirmationEmail(profile.email)
                    const registerRedirect = sessionStorage.getItem('registerRedirect')

                    if (registerRedirect) {
                        return true;
                    } else {
                        this.history.push('/empower35')
                    }
                }
            } catch (err) {
                console.error(err)
                message.error(err && err.message ? err.message : 'Registration Failed - Please Contact Our Support')
            }
        },

        async sendEmail(toUserId, formData) {
            return userService.sendEmail(this.currentUserId, toUserId, formData)
        },

        async sendRegistrationCode(email, code) {
            return userService.sendRegistrationCode(email, code)
        },

        async checkEmail(email) {
            const isExist = true
            try {
                await userService.checkEmail(email)
                return !isExist
            } catch (err) {
                return isExist
            }
        }
    }
})
