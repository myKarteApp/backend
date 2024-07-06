import { Injectable, Scope } from '@nestjs/common';
import { PrismaClient, UserInfo } from '@prisma/client';
import { CreateUserInfoDto, DefaultColumns, removeUndefined } from '@/shared';
import { SpecDatasourceProvider } from '@/spec/SpecDatasource.provider';
import { BadRequest } from '@/utils/error';
import { ErrorCode } from '@/utils/errorCode';

@Injectable({ scope: Scope.REQUEST })
export class DomainUserProvider {
  public datasource: SpecDatasourceProvider;
  /*
    create
  */
  public async createUserInfo(
    data: Omit<UserInfo, DefaultColumns>,
    _connect?: PrismaClient,
  ): Promise<void> {
    await this.connect(_connect).userInfo.create({
      data: data,
    });
  }

  // /*
  //   read
  // */
  // public async findById(
  //   authId: string,
  //   _connect?: PrismaClient,
  // ): Promise<AuthInfo | null> {
  //   return this.authDefaultProvider.findById(
  //     authId,
  //     AuthType.default,
  //     AuthRole.client,
  //     _connect,
  //   );
  // }

  // public async findByEmail(
  //   dto: DefaultAuthDto,
  //   _connect?: PrismaClient,
  // ): Promise<AuthInfo | null> {
  //   return this.authDefaultProvider.findByEmail(
  //     dto,
  //     AuthType.default,
  //     AuthRole.client,
  //     _connect,
  //   );
  // }
  // update
  public async update(
    authId: string,
    userId: string,
    dto: Partial<CreateUserInfoDto>,
    updatedBy: string,
    _connect?: PrismaClient,
  ): Promise<void> {
    const data = removeUndefined<CreateUserInfoDto>(dto);
    if (Object.keys(data).length === 0) return;

    const result: UserInfo | null = await this.connect(
      _connect,
    ).userInfo.update({
      data: {
        ...data,
        updatedBy: updatedBy,
      },
      where: {
        authId: authId,
        userId: userId,
      },
    });
    if (!result) throw BadRequest(ErrorCode.Error20);
  }
  // update
  public async delete(
    userIdList: string[],
    _connect?: PrismaClient,
  ): Promise<void> {
    const result = await this.connect(_connect).userInfo.updateMany({
      where: {
        userId: {
          in: userIdList,
        },
      },
      data: {
        isDeleted: true,
      },
    });
    if (userIdList.length !== result.count) throw BadRequest(ErrorCode.Error22);
  }
  protected connect(_connect: PrismaClient | undefined): PrismaClient {
    return _connect ? _connect : this.datasource.connect;
  }
}
