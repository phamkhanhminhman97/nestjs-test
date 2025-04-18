import { Controller, Get, Res } from '@nestjs/common';

@Controller('')
export class NestJSTestController {
  constructor() {
    //
  }

  @Get('ping')
  public ping(@Res() res) {
    res.status(200).send({
      success: true,
    });
  }
}
