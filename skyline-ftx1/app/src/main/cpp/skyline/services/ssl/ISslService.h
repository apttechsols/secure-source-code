// SPDX-License-Identifier: MPL-2.0
// Copyright © 2020 Skyline Team and Contributors (https://github.com/skyline-emu/)

#pragma once

#include <services/serviceman.h>

namespace skyline::service::ssl {
    /**
     * @brief ISslService or ssl is used by applications to manage SSL connections
     * @url https://switchbrew.org/wiki/SSL_services#ssl
     */
    class ISslService : public BaseService {
      public:
        ISslService(const DeviceState &state, ServiceManager &manager);

        /**
         * @brief Creates an SSL context
         * @url https://switchbrew.org/wiki/SSL_services#CreateContext
         */
        Result CreateContext(type::KSession &session, ipc::IpcRequest &request, ipc::IpcResponse &response);

        /**
         * @brief Sets the SSL interface version
         * @url https://switchbrew.org/wiki/SSL_services#SetInterfaceVersion
         */
        Result SetInterfaceVersion(type::KSession &session, ipc::IpcRequest &request, ipc::IpcResponse &response);

        SERVICE_DECL(
            SFUNC(0x0, ISslService, CreateContext),
            SFUNC(0x5, ISslService, SetInterfaceVersion)
        )
    };
}
