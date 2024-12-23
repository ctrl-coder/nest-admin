import { ApiProperty } from '@nestjs/swagger';

export const SUCCESS_CODE = 200;

/**
 * 响应结构
 * ok 成功
 * fail 失败
 */
export class CommonRes {
  constructor(code = SUCCESS_CODE, msg?: string, data?: any) {
    this.code = code;
    this.msg = msg || 'ok';
    this.data = data || null;
  }

  @ApiProperty({ type: 'number', default: SUCCESS_CODE })
  code: number;

  @ApiProperty({ type: 'string', default: 'ok' })
  msg?: string;

  data?: any;

  static ok(data?: any, msg = 'success'): CommonRes {
    return new CommonRes(SUCCESS_CODE, msg, data);
  }

  static fail(code: number, msg = 'fail', data?: any): CommonRes {
    return new CommonRes(code || 500, msg || 'fail', data);
  }
}
