// SPDX-FileCopyrightText: 2019-2022 Connor McLaughlin <stenzek@gmail.com>
// SPDX-License-Identifier: (GPL-3.0 OR CC-BY-NC-ND-4.0)

#pragma once
#include <array>
#include <type_traits>

// Source: https://gist.github.com/klmr/2775736#file-make_array-hpp

template<typename... T>
constexpr auto make_array(T&&... values)
  -> std::array<typename std::decay<typename std::common_type<T...>::type>::type, sizeof...(T)>
{
  return {std::forward<T>(values)...};
}
