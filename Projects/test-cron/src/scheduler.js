import nodeCron from 'node-cron'
import { resolve } from 'path'

export const initCron = async (configs) => {  
  for(const key in configs){
    if(nodeCron.validate(configs[key].frequency)){
      const path = resolve('src', configs[key].handler)
      const handler = (await import(path)).default
      nodeCron.schedule(configs[key].frequency, () => {
        handler()
      })
    }
  }
}
