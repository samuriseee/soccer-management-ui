/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import { loaiSanService } from '@/core/services/API/LoaiSanServices/LoaiSan.service'
import { useQuery } from '@tanstack/react-query'

export const useFieldTypes = () => {
    return useQuery({
        queryKey: ['fieldTypes'],
        queryFn: () => loaiSanService.getAllLoaiSan(),
        // staleTime: Infinity,
        staleTime: 1000 * 60 * 60 * 24,
        refetchOnWindowFocus: false,
    })
}

// If want refetch : queryClient.invalidateQueries({ queryKey: ['fieldTypes'] })