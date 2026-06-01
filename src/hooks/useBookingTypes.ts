/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import { loaiHinhDatService } from '@/core/services/API/LoaiHinhDatServices/LoaiHinhDat.service'
import { useQuery } from '@tanstack/react-query'

export const useBookingTypes = () => {
    return useQuery({
        queryKey: ['bookingTypes'],
        queryFn: () => loaiHinhDatService.getAllLoaiHinhDat(),
        staleTime: 1000 * 60 * 60 * 24,
        refetchOnWindowFocus: false,
    })
}

// If want refetch : queryClient.invalidateQueries({ queryKey: ['bookingTypes'] })
