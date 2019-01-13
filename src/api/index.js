import * as Login from './modules/login'
import * as Menu from './modules/menu'
import * as RoleCompany from './modules/roleCompany'
import * as RoleSystem from './modules/roleSystem'
import * as FunctionMana from './modules/functionMana'
import * as ServerMana from './modules/serverMana'
import * as CompanyMana from './modules/companyMana'

export default Object.assign({}, Login, Menu, RoleCompany, RoleSystem, FunctionMana, ServerMana, CompanyMana)