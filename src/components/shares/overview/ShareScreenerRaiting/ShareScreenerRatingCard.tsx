import SvgImage from "components/common/image/SvgImage";
import { InstrumentGroup, TheScreenerRating } from "generated/graphql";
import { Link } from "react-router-dom";
import { formatDate, getFinanztreffAssetLink } from "utils";

interface ShareScreenerRatingCardProps{
    instrumentGroup?: InstrumentGroup;
    status?: string;
    date?: string;
    previousRating?: TheScreenerRating | number;
    updatedRating?: TheScreenerRating | number;
    showStatus: boolean;
    nameIsBold: boolean;
    name?: string;
    }

  function ShareScreenerRatingCard({previousRating, updatedRating, date, instrumentGroup, status, showStatus, nameIsBold, name}:ShareScreenerRatingCardProps){
    
    name= instrumentGroup ? instrumentGroup.name : name || "";
    
    return(
          <>
              <div className={"pb-2"}>
                  <div className={"product-type-wrapper text-center"}>
                  <Link
                    to={getFinanztreffAssetLink((instrumentGroup?.assetGroup || "").toString(), instrumentGroup?.seoTag || "")}
                    className={`${nameIsBold && `font-weight-bold`} product-type-wrapper text-center text-dark`}
                >{ name.length> 28 ? name.slice(0,28) + "..." : name}</Link>
                  {/* <span className={`${nameIsBold && `font-weight-bold`} product-type-wrapper text-center`}>{ name.length> 28 ? name.slice(0,28) + "..." : name}</span> */}
              </div>
                  <div className={"d-flex align-items-center justify-content-center"}>
                  <div className="stars-holder img-width-small-desktop d-inline-flex justify-content-end" style={{minWidth: 85}}>
                      {
                          Array(previousRating)
                              .fill(1)
                              .map((val:TheScreenerRating | number | undefined, index: number) => <SvgImage icon="icon_star_filled.svg"  imgClass="svg-blue mr-n2" convert={false} width="27"/>)
                      }
              </div>
                  <div className="d-inline-flex ml-5px mr-5px">
                                    <span className="svg-icon">
                                        <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_arrow_screener_dark.svg"} alt=""/>
                                    </span>
                  </div>
                  <div className="stars-holder img-width-small-desktop d-inline-flex ml-n2" style={{minWidth: 85}}>
                      {
                          Array(updatedRating)
                              .fill(1)
                              .map((val:TheScreenerRating | number | undefined, index: number) => <SvgImage icon="icon_star_filled.svg"  imgClass="svg-blue mr-n2" convert={false} width="27"/>)
                      }
                  </div>
                      </div>
                  {
                      showStatus ?
                          <div className={"product-type-wrapper text-center"} style={{fontSize:"15px"}}>
                              <span className={"mr-2"}>{status}</span>
                              <span>{ formatDate(date)}</span>
                          </div>
                          :
                          <></>
                  }

              </div>
          </>
      )
  }

  export default ShareScreenerRatingCard
