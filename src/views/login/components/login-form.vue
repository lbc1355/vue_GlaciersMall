<template>
  <div class="account-box">
    <div class="toggle">
      <a @click="isMsgLogin = false" href="javascript:;" v-if="isMsgLogin">
        <i class="iconfont icon-user"></i> 使用账号登录
      </a>
      <a @click="isMsgLogin = true" href="javascript:;" v-else>
        <i class="iconfont icon-msg"></i> 使用短信登录
      </a>
    </div>
    <Form
      ref="formCom"
      class="form"
      :validation-schema="schema"
      v-slot="{ errors }"
      autocomplete="off"
    >
      <template v-if="!isMsgLogin">
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field
              :class="{ error: errors.account }"
              v-model="form.account"
              name="account"
              type="text"
              placeholder="请输入用户名或手机号"
            />
          </div>

          <div class="error">
            <i class="iconfont icon-warning" v-if="errors.account" />
            {{ errors.account }}
          </div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-lock"></i>
            <Field
              :class="{ error: errors.password }"
              v-model="form.password"
              name="password"
              type="password"
              placeholder="请输入密码"
            />
          </div>

          <div class="error">
            <i class="iconfont icon-warning" v-if="errors.password" />
            {{ errors.password }}
          </div>
        </div>
      </template>
      <template v-else>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field
              :class="{ error: errors.mobile }"
              v-model="form.mobile"
              name="mobile"
              type="text"
              placeholder="请输入手机号"
            />
          </div>

          <div class="error">
            <i class="iconfont icon-warning" v-if="errors.mobile" />
            {{ errors.mobile }}
          </div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-code"></i>
            <Field
              :class="{ error: errors.code }"
              v-model="form.code"
              name="code"
              type="password"
              placeholder="请输入验证码"
            />
            <span @click="send" class="code">
              {{ time === 0 ? "发送验证码" : `${time}秒后发送` }}
            </span>
          </div>

          <div class="error">
            <i class="iconfont icon-warning" v-if="errors.code" />
            {{ errors.code }}
          </div>
        </div>
      </template>
      <div class="form-item">
        <div class="agree">
          <Field as="XtxCheckbox" name="isAgree" v-model="form.isAgree" />
          <span>我已同意</span>
          <a href="javascript:;">《隐私条款》</a>
          <span>和</span>
          <a href="javascript:;">《服务条款》</a>
        </div>

        <div class="error">
          <i class="iconfont icon-warning" v-if="errors.isAgree" />
          {{ errors.isAgree }}
        </div>
      </div>

      <a @click="login" href="javascript:;" class="btn">登录</a>
    </Form>
    <div class="action">
      <img
        src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png"
        alt=""
      />
      <div class="url">
        <a href="javascript:;">忘记密码</a>
        <a href="javascript:;">免费注册</a>
      </div>
    </div>
  </div>
</template>
<script>
import { onUnmounted, reactive, ref, watch } from 'vue'
import { Form, Field } from 'vee-validate'
import schema from '@/utils/vee-validate-schema'
import Message from '@/components/library/Message'
import { userAccountLogin, userMobileLogin, userMobileLoginMsg } from '@/api/user'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { useIntervalFn } from '@vueuse/core'
export default {
  name: 'LoginForm',
  components: {
    Form, Field
  },
  setup () {
    // 是否短信登录
    const isMsgLogin = ref(false)
    // 表单信息对象
    const form = reactive({
      isAgree: true,
      account: null,
      password: null,
      mobile: null,
      code: null
    })
    // vee-validae 校验基本步骤
    // 1 导入Form Field 组件 将form 和 input 进行替换
    // 2 Field 需要进行数据绑定，字段名最好和后台接口保持一致
    // 3 定义name属性指定的校验规则函数
    // 4 自定义组件需要校验必须先支持v-model 然后field使用as指定为组件名称
    const formCom = ref(null)
    const mySchema = {
      account: schema.account,
      password: schema.password,
      mobile: schema.mobile,
      code: schema.code,
      isAgree: schema.isAgree
    }

    // 监听isMsgLogin 重置表单
    watch(isMsgLogin, () => {
      // 重置数据
      form.isMsgLogin = true
      form.account = null
      form.password = null
      form.mobile = null
      form.code = null
      //  如果是没有销毁field组件 之前的校验结果不会消耗
      // Form 组件提供了一个resetForm 函数清除校验结果
      formCom.value.resetForm()
    })

    // 点击登录的时候对整体表单进行校验
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const login = async () => {
      try {
        let data = null
        // Form组件提供了一个validate函数作为整体表单校验
        // 返回的是一个promise
        const valid = await formCom.value.validate()
        // 如果校验成功
        if (valid) {
          if (isMsgLogin.value) {
            // 手机号登录
            const { mobile, code } = form
            data = await userMobileLogin({ mobile, code })
            // 如果失败，失败显示
          } else {
            // 用户密码登录
            const { account, password } = form
            data = await userAccountLogin({ account, password })
          }
          // 存储用户信息
          const { id, account, avatar, mobile, nickname, token } = data.result
          store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
          // 进行跳转
          router.push(route.query.redirectUrl || '/')
          // 消息提示
          Message({ type: 'success', text: '登录成功' })
        }
      } catch (e) {
        if (e.response.data) {
          Message({ type: 'error', text: e.response.data.message || '登陆失败' })
        }
      }
    }
    // pause 暂停 resume 开启
    const time = ref(0)
    const { pause, resume } = useIntervalFn(() => {
      time.value--
      if (time.value <= 0) {
        pause()
        time.value = 0
      }
    }, 1000, { immediate: false })
    // 销毁组件
    onUnmounted(() => {
      console.log('销毁了')
      pause()
    })

    // 发送验证码
    // 1.1 绑定发送验证码按钮点击事件
    // 1.2校验手机号 如果成功才去发送短行，请求成功开启60s倒计时，不能再次点击
    const send = async () => {
      const valid = mySchema.mobile(form.mobile)
      if (valid === true) {
        // 通过
        if (time.value === 0) {
          try {
            // 没有倒计时才可以发送
            await userMobileLoginMsg(form.mobile)

            Message({ type: 'success', text: '发送成功' })
            time.value = 60
            resume()
          } catch (e) {
            if (e.response.data) {
              Message({ type: 'error', text: e.response.data.message || '验证码发送失败' })
            }
          }
        }
        // 没有倒计时才可以发送
      } else {
        // 失败 使用vee的错误函数显示错误信息，setFieldError(字段，错误信息)
        formCom.value.setFieldError('mobile', valid)
      }
    }
    return {
      isMsgLogin,
      form,
      schema: mySchema,
      formCom,
      login,
      send,
      time
    }
  }
}
</script>

<style scoped lang='less'>
// 账号容器
.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;
    a {
      color: @xtxColor;
      i {
        font-size: 14px;
      }
    }
  }
  .form {
    padding: 0 40px;
    &-item {
      margin-bottom: 28px;
      .input {
        position: relative;
        height: 36px;
        > i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }
        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;
          &.error {
            border-color: @priceColor;
          }
          &.active,
          &:focus {
            border-color: @xtxColor;
          }
        }
        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
        }
      }
      > .error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: @priceColor;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }
    .agree {
      a {
        color: #069;
      }
    }
    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: @xtxColor;
      &.disabled {
        background: #cfcdcd;
      }
    }
  }
  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
</style>
