"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MapPin, Loader2, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PlaceResult {
  address: string
  latitude: number
  longitude: number
}

interface AddressAutocompleteProps {
  value: string
  onSelect: (result: PlaceResult) => void
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

/**
 * Busca de endereço via Google Places API (Text Search).
 * - Input de texto simples + botão
 * - UMA chamada de API por busca
 * - Bias para Uberlândia, MG
 */
export function AddressAutocomplete({
  value,
  onSelect,
  onChange,
  placeholder = "Ex: Rua Coronel Antônio Alves, 123, Centro...",
  disabled = false,
}: AddressAutocompleteProps) {
  const [isSearching, setIsSearching] = useState(false)
  const { toast } = useToast()

  const handleSearch = async () => {
    const trimmed = value.trim()
    if (trimmed.length < 5) {
      toast({
        title: "Endereço muito curto",
        description: "Digite pelo menos o nome da rua ou local",
        variant: "destructive",
      })
      return
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      toast({
        title: "API Key não configurada",
        description: "Configure NEXT_PUBLIC_GOOGLE_MAPS_API_KEY no .env",
        variant: "destructive",
      })
      return
    }

    setIsSearching(true)
    try {
      // Coordenadas de Uberlândia, MG para bias de busca
      const UBERLANDIA_LAT = -18.9188
      const UBERLANDIA_LON = -48.2766

      // Adiciona ", Uberlândia" se não estiver explícito
      const query = trimmed.toLowerCase().includes("uberlândia") 
        ? trimmed 
        : `${trimmed}, Uberlândia, MG`

      const res = await fetch(
        `https://places.googleapis.com/v1/places:searchText`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": apiKey,
            "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.location",
          },
          body: JSON.stringify({
            textQuery: query,
            languageCode: "pt-BR",
            locationBias: {
              circle: {
                center: { latitude: UBERLANDIA_LAT, longitude: UBERLANDIA_LON },
                radius: 50000, // 50km ao redor de Uberlândia
              },
            },
          }),
        }
      )

      if (!res.ok) {
        const errorText = await res.text()
        console.error("Google Places API error:", res.status, errorText)
        throw new Error(`API error: ${res.status}`)
      }

      const data = await res.json()

      if (!data.places || data.places.length === 0) {
        toast({
          title: "Endereço não encontrado",
          description: "Tente: nome da rua, número, bairro ou ponto de referência",
          variant: "destructive",
        })
        return
      }

      // Pega o primeiro resultado (mais relevante)
      const place = data.places[0]
      const lat = place.location?.latitude || 0
      const lon = place.location?.longitude || 0
      const addr = place.formattedAddress || place.displayName?.text || ""

      if (!lat || !lon || !addr) {
        throw new Error("Dados incompletos retornados pela API")
      }

      // Atualiza o input com o endereço formatado
      onChange(addr)
      // Chama onSelect com coordenadas
      onSelect({ address: addr, latitude: lat, longitude: lon })

      toast({
        title: "✓ Coordenadas obtidas",
        description: `${lat.toFixed(6)}, ${lon.toFixed(6)}`,
      })
    } catch (error) {
      console.error("Places API search error:", error)
      toast({
        title: "Erro ao buscar coordenadas",
        description: error instanceof Error ? error.message : "Verifique a configuração da API",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              handleSearch()
            }
          }}
          placeholder={placeholder}
          disabled={disabled || isSearching}
          className="pl-9"
        />
      </div>
      <Button
        type="button"
        onClick={handleSearch}
        disabled={disabled || isSearching || value.trim().length < 5}
        variant="secondary"
      >
        {isSearching ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <Search className="w-4 h-4 mr-2" />
            Buscar
          </>
        )}
      </Button>
    </div>
  )
}
