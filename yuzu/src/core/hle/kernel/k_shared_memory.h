// SPDX-FileCopyrightText: 2014 Citra Emulator Project
// SPDX-License-Identifier: GPL-2.0-or-later

#pragma once

#include <optional>
#include <string>

#include "common/common_types.h"
#include "core/device_memory.h"
#include "core/hle/kernel/k_memory_block.h"
#include "core/hle/kernel/k_page_group.h"
#include "core/hle/kernel/k_process.h"
#include "core/hle/kernel/slab_helpers.h"
#include "core/hle/result.h"

namespace Kernel {

class KernelCore;

class KSharedMemory final
    : public KAutoObjectWithSlabHeapAndContainer<KSharedMemory, KAutoObjectWithList> {
    KERNEL_AUTOOBJECT_TRAITS(KSharedMemory, KAutoObject);

public:
    explicit KSharedMemory(KernelCore& kernel_);
    ~KSharedMemory() override;

    Result Initialize(Core::DeviceMemory& device_memory_, KProcess* owner_process_,
                      Svc::MemoryPermission owner_permission_,
                      Svc::MemoryPermission user_permission_, std::size_t size_, std::string name_);

    /**
     * Maps a shared memory block to an address in the target process' address space
     * @param target_process Process on which to map the memory block
     * @param address Address in system memory to map shared memory block to
     * @param map_size Size of the shared memory block to map
     * @param permissions Memory block map permissions (specified by SVC field)
     */
    Result Map(KProcess& target_process, VAddr address, std::size_t map_size,
               Svc::MemoryPermission permissions);

    /**
     * Unmaps a shared memory block from an address in the target process' address space
     * @param target_process Process on which to unmap the memory block
     * @param address Address in system memory to unmap shared memory block
     * @param unmap_size Size of the shared memory block to unmap
     */
    Result Unmap(KProcess& target_process, VAddr address, std::size_t unmap_size);

    /**
     * Gets a pointer to the shared memory block
     * @param offset Offset from the start of the shared memory block to get pointer
     * @return A pointer to the shared memory block from the specified offset
     */
    u8* GetPointer(std::size_t offset = 0) {
        return device_memory->GetPointer<u8>(physical_address + offset);
    }

    /**
     * Gets a pointer to the shared memory block
     * @param offset Offset from the start of the shared memory block to get pointer
     * @return A pointer to the shared memory block from the specified offset
     */
    const u8* GetPointer(std::size_t offset = 0) const {
        return device_memory->GetPointer<u8>(physical_address + offset);
    }

    void Finalize() override;

    bool IsInitialized() const override {
        return is_initialized;
    }
    static void PostDestroy([[maybe_unused]] uintptr_t arg) {}

private:
    Core::DeviceMemory* device_memory{};
    KProcess* owner_process{};
    std::optional<KPageGroup> page_group{};
    Svc::MemoryPermission owner_permission{};
    Svc::MemoryPermission user_permission{};
    PAddr physical_address{};
    std::size_t size{};
    KResourceLimit* resource_limit{};
    bool is_initialized{};
};

} // namespace Kernel
