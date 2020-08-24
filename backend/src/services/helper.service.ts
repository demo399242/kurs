import { Injectable } from '@nestjs/common'
import { Repository, EntityManager } from 'typeorm'
import { User } from '@entities/user.entity'

@Injectable()
export class HelperService {

  private readonly users: Repository<User>

  // - - - - - - - - - - - - - - - - - - - - - 
  // Конструктор
  // - - - - - - - - - - - - - - - - - - - - -
  constructor(

    //@InjectEntityManager()
		private readonly manager: EntityManager,

    // @InjectRepository(User)
    // private readonly users: Repository<User>,
 
    // @InjectRepository(SmsCode)
    // private readonly smscodes: Repository<SmsCode>,

  ){

    this.users = this.manager.getRepository(User)

  }

}
