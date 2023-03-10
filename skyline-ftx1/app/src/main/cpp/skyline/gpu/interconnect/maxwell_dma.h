// SPDX-License-Identifier: MPL-2.0
// Copyright © 2022 Ryujinx Team and Contributors (https://github.com/ryujinx/)
// Copyright © 2022 Skyline Team and Contributors (https://github.com/skyline-emu/)

#pragma once

#include <soc/gm20b/gmmu.h>

namespace skyline::gpu {
    class GPU;
}

namespace skyline::soc::gm20b {
    struct ChannelContext;
}

namespace skyline::gpu::interconnect {
    class CommandExecutor;

    /**
     * @brief Handles translating Maxwell DMA operations to Vulkan
     */
    class MaxwellDma {
      private:
        using IOVA = soc::gm20b::IOVA;

        GPU &gpu;
        soc::gm20b::ChannelContext &channelCtx;
        gpu::interconnect::CommandExecutor &executor;

      public:
        MaxwellDma(GPU &gpu, soc::gm20b::ChannelContext &channelCtx);

        void Copy(IOVA dst, IOVA src, size_t size);
    };
}
